import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionTier } from '../../models/SubscriptionTier';
import { UserSubscription } from '../../models/UserSubscription';
import { SubscriptionPageAccess } from '../../models/SubscriptionPageAccess';
import { SubscriptionPayment } from '../../models/SubscriptionPayment';

@Injectable()
export class SubscriptionsService {
    constructor(@Inject('KnexConnection') private readonly knex) {}

    async listTiers() {
        try {
            const hasIsActive = await this.knex.schema.hasColumn('subscription_tiers', 'is_active');
            const hasSortOrder = await this.knex.schema.hasColumn('subscription_tiers', 'sort_order');
            let q = SubscriptionTier.query(this.knex);
            if (hasIsActive) q = q.where('is_active', true);
            if (hasSortOrder) q = q.orderBy('sort_order', 'asc');
            return await q;
        } catch {
            return this.knex('subscription_tiers').select('*');
        }
    }

    async listTiersForAdmin() {
        try {
            const hasSortOrder = await this.knex.schema.hasColumn('subscription_tiers', 'sort_order');
            if (hasSortOrder) {
                return await this.knex('subscription_tiers').orderBy('sort_order', 'asc');
            }
            return await this.knex('subscription_tiers').select('*');
        } catch {
            return this.knex('subscription_tiers').select('*');
        }
    }

    async getTier(id: number) {
        const tier = await SubscriptionTier.query(this.knex).findById(id);
        if (!tier) throw new NotFoundException('Subscription tier not found');
        return tier;
    }

    async getPageAccess(tierId: number) {
        return SubscriptionPageAccess.query(this.knex).where('tier_id', tierId);
    }

    // ===== Tier feature flags (redesign parity) =====
    private tierFeaturesReady = false;
    private async ensureTierFeaturesSchema() {
        if (this.tierFeaturesReady) return;
        if (!(await this.knex.schema.hasTable('subscription_tier_features'))) {
            await this.knex.schema.createTable('subscription_tier_features', (table: any) => {
                table.increments('id').primary();
                table.string('feature_key').notNullable();
                table.string('label').notNullable();
                table
                    .integer('tier_id')
                    .unsigned()
                    .notNullable()
                    .references('id')
                    .inTable('subscription_tiers')
                    .onDelete('CASCADE');
                table.boolean('enabled').defaultTo(false);
                table.timestamp('created_at').defaultTo(this.knex.fn.now());
                table.timestamp('updated_at').defaultTo(this.knex.fn.now());
                table.unique(['feature_key', 'tier_id']);
            });
        }
        this.tierFeaturesReady = true;
    }

    async listTierFeatures() {
        await this.ensureTierFeaturesSchema();
        const rows = await this.knex('subscription_tier_features')
            .leftJoin('subscription_tiers', 'subscription_tier_features.tier_id', 'subscription_tiers.id')
            .select('subscription_tier_features.*', 'subscription_tiers.name as tier_name')
            .orderBy('subscription_tier_features.feature_key', 'asc');
        const grouped = new Map<string, any>();
        for (const row of rows) {
            const key = row.feature_key;
            if (!grouped.has(key)) grouped.set(key, { featureKey: key, label: row.label, tiers: {} });
            grouped.get(key).tiers[row.tier_id] = { enabled: Boolean(row.enabled), tierName: row.tier_name };
        }
        return Array.from(grouped.values());
    }

    async createFeature(featureKey: string, label: string) {
        await this.ensureTierFeaturesSchema();
        const key = String(featureKey || '').trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_');
        if (!key) throw new BadRequestException('Invalid feature key');
        const existing = await this.knex('subscription_tier_features').where('feature_key', key).first();
        if (existing) throw new BadRequestException('A feature with this key already exists');
        const tiers = await this.knex('subscription_tiers').select('id');
        if (!tiers.length) throw new BadRequestException('No subscription tiers exist yet');
        await this.knex('subscription_tier_features').insert(
            tiers.map((tier: any) => ({
                feature_key: key,
                label: String(label || key).trim(),
                tier_id: tier.id,
                enabled: false,
            })),
        );
        return this.listTierFeatures();
    }

    async deleteFeature(featureKey: string) {
        await this.ensureTierFeaturesSchema();
        await this.knex('subscription_tier_features').where('feature_key', featureKey).delete();
        return this.listTierFeatures();
    }

    async setTierFeature(tierId: number, featureKey: string, enabled: boolean) {
        await this.ensureTierFeaturesSchema();
        const row = await this.knex('subscription_tier_features')
            .where({ tier_id: tierId, feature_key: featureKey })
            .first();
        if (!row) {
            await this.knex('subscription_tier_features').insert({
                tier_id: tierId,
                feature_key: featureKey,
                label: featureKey,
                enabled,
            });
        } else {
            await this.knex('subscription_tier_features')
                .where({ tier_id: tierId, feature_key: featureKey })
                .update({ enabled });
        }
        return this.listTierFeatures();
    }

    async hasFeature(userId: number | null | undefined, featureKey: string): Promise<boolean> {
        if (!userId) return false;
        await this.ensureTierFeaturesSchema();
        const sub = await UserSubscription.query(this.knex)
            .where({ user_id: userId, status: 'active' })
            .orderBy('created_at', 'desc')
            .first();
        if (!sub) return false;
        const flag = await this.knex('subscription_tier_features')
            .where({ tier_id: (sub as any).tier_id, feature_key: featureKey })
            .first();
        return Boolean(flag?.enabled);
    }

    async getUserSubscription(userId: number) {
        return UserSubscription.query(this.knex)
            .where('user_id', userId)
            .orderBy('created_at', 'desc')
            .first();
    }

    async createSubscription(data: { user_id: number; tier_id: number; status?: 'active' | 'canceled' | 'expired' | 'trial'; payment_id?: number }) {
        const tier = await this.getTier(data.tier_id);
        const now = new Date();
        const end = new Date(now);
        end.setMonth(end.getMonth() + 1);

        return UserSubscription.query(this.knex).insertAndFetch({
            user_id: data.user_id,
            tier_id: data.tier_id,
            status: (data.status || 'trial') as 'active' | 'canceled' | 'expired' | 'trial',
            current_period_start: now.toISOString().slice(0, 19).replace('T', ' '),
            current_period_end: end.toISOString().slice(0, 19).replace('T', ' '),
            payment_id: data.payment_id || null,
        });
    }

    async cancelSubscription(id: number, userId: number) {
        const sub = await UserSubscription.query(this.knex).findById(id);
        if (!sub || sub.user_id !== userId) throw new NotFoundException('Subscription not found');
        return UserSubscription.query(this.knex).patchAndFetchById(id, {
            status: 'canceled',
            canceled_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        });
    }

    async listAllSubscriptions() {
        return UserSubscription.query(this.knex).orderBy('created_at', 'desc');
    }

    // ===== PAYMENT ENDPOINTS =====

    async getPaymentSettings() {
        try {
            const rows = await this.knex('app_settings').where('key', 'like', 'payment.%');
            const settings: Record<string, any> = {
                enabled: true,
                method: "Bank Transfer",
                beneficiary: "",
                bank: "",
                account: "",
                reference: "",
                currency: "USD",
                instructions: "",
                proofRequired: true
            };
            for (const row of rows) {
                const cleanKey = row.key.replace('payment.', '');
                settings[cleanKey] = row.value;
            }
            return settings;
        } catch {
            return {
                enabled: true,
                method: "Bank Transfer",
                beneficiary: "Roots Tunisia Support",
                bank: "BiAT Bank Tunisia",
                account: "TN59 1000 1234 5678 9012 3456",
                reference: "ROOTS-SUB",
                currency: "USD",
                instructions: "Please transfer the subscription fee to the bank account above and upload your receipt screenshot.",
                proofRequired: true
            };
        }
    }

    async submitPayment(data: {
        user_id: number;
        tier_id: number;
        amount: number;
        proof_url?: string;
        notes?: string;
    }) {
        const tier = await this.getTier(data.tier_id);
        if (tier.price === 0) throw new BadRequestException('Free tiers do not require payment');

        return SubscriptionPayment.query(this.knex).insertAndFetch({
            user_id: data.user_id,
            tier_id: data.tier_id,
            amount: data.amount,
            proof_url: data.proof_url || null,
            notes: data.notes || null,
            status: 'pending',
        });
    }

    async listMyPayments(userId: number) {
        return SubscriptionPayment.query(this.knex)
            .where('user_id', userId)
            .orderBy('created_at', 'desc');
    }

    async listAllPayments(status?: string) {
        const query = SubscriptionPayment.query(this.knex).orderBy('created_at', 'desc');
        if (status) query.where('status', status);
        return query;
    }

    async reviewPayment(id: number, reviewerId: number, decision: 'approved' | 'rejected') {
        const payment = await SubscriptionPayment.query(this.knex).findById(id);
        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== 'pending') throw new BadRequestException('Payment already reviewed');

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const updated = await SubscriptionPayment.query(this.knex).patchAndFetchById(id, {
            status: decision,
            reviewed_by: reviewerId,
            reviewed_at: now,
        });

        // If approved, create or update user subscription
        if (decision === 'approved') {
            const existing = await this.getUserSubscription(payment.user_id);
            const tier = await this.getTier(payment.tier_id);
            const periodStart = new Date();
            const periodEnd = new Date();
            periodEnd.setMonth(periodEnd.getMonth() + 1);

            const subData = {
                user_id: payment.user_id,
                tier_id: payment.tier_id,
                status: 'active' as 'active' | 'canceled' | 'expired' | 'trial',
                current_period_start: periodStart.toISOString().slice(0, 19).replace('T', ' '),
                current_period_end: periodEnd.toISOString().slice(0, 19).replace('T', ' '),
                payment_id: payment.id,
            };

            if (existing) {
                await UserSubscription.query(this.knex).patchAndFetchById(existing.id, subData);
            } else {
                await UserSubscription.query(this.knex).insertAndFetch(subData);
            }
        }

        return updated;
    }

    async upgradeUserSubscription(targetUserId: number, newTierId: number, adminUserId: number) {
        const tier = await this.getTier(newTierId);
        const existing = await this.getUserSubscription(targetUserId);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const end = new Date();
        end.setMonth(end.getMonth() + 1);

        const subData = {
            user_id: targetUserId,
            tier_id: newTierId,
            status: 'active' as 'active' | 'canceled' | 'expired' | 'trial',
            current_period_start: now,
            current_period_end: end.toISOString().slice(0, 19).replace('T', ' '),
        };

        if (existing) {
            return UserSubscription.query(this.knex).patchAndFetchById(existing.id, subData);
        }
        return UserSubscription.query(this.knex).insertAndFetch(subData);
    }

    // ===== CREATION QUOTA LIMITS SYSTEM =====

    async getUserQuotas(userId: number) {
        const user = await this.knex('users').where({ id: userId }).first();
        if (!user) throw new NotFoundException('User not found');

        const roleId = Number(user.role_id ?? user.roleId ?? user.role ?? 2);
        const isSuperAdmin = roleId === 3 || roleId === 1;

        const sub = await UserSubscription.query(this.knex)
            .where({ user_id: userId, status: 'active' })
            .orderBy('created_at', 'desc')
            .first();
        const tierId = isSuperAdmin ? 3 : (sub ? (sub as any).tier_id : 1);
        const tier = await this.knex('subscription_tiers').where({ id: tierId }).first();

        const resources = ['trees', 'gallery', 'audios', 'documents', 'individuals', 'sources', 'notes', 'tasks'] as const;
        const result: Record<string, { used: number; max: number; custom: boolean }> = {};

        for (const res of resources) {
            let limit = -1;
            let isCustom = false;
            const customCol = `custom_max_${res}`;
            const tierCol = `max_${res}`;

            if (isSuperAdmin) {
                limit = -1;
            } else if (user[customCol] !== null && user[customCol] !== undefined) {
                limit = Number(user[customCol]);
                isCustom = true;
            } else if (tier && tier[tierCol] !== null && tier[tierCol] !== undefined) {
                limit = Number(tier[tierCol]);
            } else {
                const defaults: Record<string, number> = { trees: 25, gallery: 25, audios: 25, documents: 25, individuals: 25, sources: 25, notes: 25, tasks: 25 };
                limit = defaults[res] ?? 25;
            }

            let currentCount = 0;
            if (res === 'trees') {
                const treeQuery = this.knex('family_trees').where({ user_id: userId });
                if (await this.knex.schema.hasColumn('family_trees', 'author_id')) {
                    treeQuery.orWhere({ author_id: userId });
                }
                if (await this.knex.schema.hasColumn('family_trees', 'created_by')) {
                    treeQuery.orWhere({ created_by: userId });
                }
                const row = await treeQuery.count('id as cnt').first();
                currentCount = Number(row?.cnt || 0);
            } else if (res === 'gallery') {
                const row = await this.knex('gallery')
                    .where({ uploaded_by: userId })
                    .orWhere({ user_id: userId })
                    .count('id as cnt').first();
                currentCount = Number(row?.cnt || 0);
            } else if (res === 'audios') {
                const row = await this.knex('audios')
                    .where({ uploaded_by: userId })
                    .orWhere({ user_id: userId })
                    .count('id as cnt').first();
                currentCount = Number(row?.cnt || 0);
            } else if (res === 'documents') {
                const row = await this.knex('documents')
                    .where({ uploaded_by: userId })
                    .orWhere({ user_id: userId })
                    .count('id as cnt').first();
                currentCount = Number(row?.cnt || 0);
            } else if (res === 'individuals') {
                let cnt = 0;
                if (await this.knex.schema.hasTable('individuals')) {
                    const row = await this.knex('individuals')
                        .where({ user_id: userId })
                        .orWhere({ created_by: userId })
                        .count('id as cnt').first();
                    cnt += Number(row?.cnt || 0);
                }
                if (await this.knex.schema.hasTable('persons')) {
                    const userTreeIds = (await this.knex('family_trees').where({ user_id: userId }).select('id')).map((t) => t.id);
                    if (userTreeIds.length > 0) {
                        const pRow = await this.knex('persons').whereIn('tree_id', userTreeIds).count('id as cnt').first();
                        cnt += Number(pRow?.cnt || 0);
                    }
                }
                currentCount = cnt;
            } else if (res === 'sources') {
                if (await this.knex.schema.hasTable('user_sources')) {
                    const row = await this.knex('user_sources').where({ user_id: userId }).count('id as cnt').first();
                    currentCount = Number(row?.cnt || 0);
                }
            } else if (res === 'notes') {
                if (await this.knex.schema.hasTable('notes')) {
                    const row = await this.knex('notes').where({ user_id: userId }).count('id as cnt').first();
                    currentCount = Number(row?.cnt || 0);
                }
            } else if (res === 'tasks') {
                if (await this.knex.schema.hasTable('tasks')) {
                    const row = await this.knex('tasks').where({ user_id: userId }).count('id as cnt').first();
                    currentCount = Number(row?.cnt || 0);
                }
            }

            result[res] = { used: currentCount, max: limit, custom: isCustom };
        }

        return { userId, tierId, tierName: tier?.name || 'Basic', isSuperAdmin, limits: result };
    }

    async checkUserQuota(userId: number, resource: 'trees' | 'gallery' | 'audios' | 'documents' | 'individuals' | 'sources' | 'notes' | 'tasks') {
        if (!userId) return;
        const quotas = await this.getUserQuotas(userId);
        if (quotas.isSuperAdmin) return; // Super admin unlimited

        const quota = quotas.limits[resource];
        if (!quota) return;

        if (quota.max !== -1 && quota.used >= quota.max) {
            throw new BadRequestException(
                `Creation limit reached for your account (${quota.used}/${quota.max} ${resource}). Please upgrade your subscription to create more.`
            );
        }
    }

    async updateTierLimits(tierId: number, limits: { max_trees?: number; max_gallery?: number; max_audios?: number; max_documents?: number; max_individuals?: number }) {
        await this.getTier(tierId);
        const patch: any = {};
        if (limits.max_trees !== undefined) patch.max_trees = limits.max_trees;
        if (limits.max_gallery !== undefined) patch.max_gallery = limits.max_gallery;
        if (limits.max_audios !== undefined) patch.max_audios = limits.max_audios;
        if (limits.max_documents !== undefined) patch.max_documents = limits.max_documents;
        if (limits.max_individuals !== undefined) patch.max_individuals = limits.max_individuals;

        await this.knex('subscription_tiers').where({ id: tierId }).update(patch);
        return this.knex('subscription_tiers').where({ id: tierId }).first();
    }

    async updateUserLimits(userId: number, limits: { custom_max_trees?: number | null; custom_max_gallery?: number | null; custom_max_audios?: number | null; custom_max_documents?: number | null; custom_max_individuals?: number | null }) {
        const user = await this.knex('users').where({ id: userId }).first();
        if (!user) throw new NotFoundException('User not found');
        const patch: any = {};
        if (limits.custom_max_trees !== undefined) patch.custom_max_trees = limits.custom_max_trees;
        if (limits.custom_max_gallery !== undefined) patch.custom_max_gallery = limits.custom_max_gallery;
        if (limits.custom_max_audios !== undefined) patch.custom_max_audios = limits.custom_max_audios;
        if (limits.custom_max_documents !== undefined) patch.custom_max_documents = limits.custom_max_documents;
        if (limits.custom_max_individuals !== undefined) patch.custom_max_individuals = limits.custom_max_individuals;

        await this.knex('users').where({ id: userId }).update(patch);
        return this.getUserQuotas(userId);
    }
}
