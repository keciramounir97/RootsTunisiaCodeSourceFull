import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubscriptionTier } from '../../models/SubscriptionTier';
import { UserSubscription } from '../../models/UserSubscription';
import { SubscriptionPageAccess } from '../../models/SubscriptionPageAccess';
import { SubscriptionPayment } from '../../models/SubscriptionPayment';

@Injectable()
export class SubscriptionsService {
    constructor(@Inject('KnexConnection') private readonly knex) {}

    private mapTier(row: any) {
        if (!row) return row;
        let features: string[] = [];
        try {
            if (Array.isArray(row.features)) {
                features = row.features;
            } else if (typeof row.features === 'string' && row.features.trim()) {
                features = JSON.parse(row.features);
            }
        } catch {
            features = [];
        }
        return {
            ...row,
            price: Number(row.price ?? 0),
            is_active: row.is_active === undefined || row.is_active === null ? true : Boolean(row.is_active),
            features,
        };
    }

    async listTiers() {
        try {
            const hasIsActive = await this.knex.schema.hasColumn('subscription_tiers', 'is_active');
            const hasSortOrder = await this.knex.schema.hasColumn('subscription_tiers', 'sort_order');
            let q = SubscriptionTier.query(this.knex);
            // NULL means active for legacy rows before is_active was backfilled
            if (hasIsActive) {
                q = q.where((builder: any) =>
                    builder.where('is_active', true).orWhereNull('is_active'),
                );
            }
            if (hasSortOrder) q = q.orderBy('sort_order', 'asc');
            const rows = await q;
            return (rows || []).map((row: any) => this.mapTier(row));
        } catch {
            const rows = await this.knex('subscription_tiers').select('*');
            return (rows || []).map((row: any) => this.mapTier(row));
        }
    }

    async listTiersForAdmin() {
        try {
            const hasSortOrder = await this.knex.schema.hasColumn('subscription_tiers', 'sort_order');
            const rows = hasSortOrder
                ? await this.knex('subscription_tiers').orderBy('sort_order', 'asc')
                : await this.knex('subscription_tiers').select('*');
            return (rows || []).map((row: any) => this.mapTier(row));
        } catch {
            const rows = await this.knex('subscription_tiers').select('*');
            return (rows || []).map((row: any) => this.mapTier(row));
        }
    }

    async getTier(id: number) {
        const tier = await SubscriptionTier.query(this.knex).findById(id);
        if (!tier) throw new NotFoundException('Subscription tier not found');
        return this.mapTier(tier);
    }

    async updateTierContent(
        tierId: number,
        dto: {
            name?: string;
            price?: number;
            badge?: string;
            description?: string;
            tagline?: string;
            features?: string[] | string;
            is_active?: boolean;
        },
    ) {
        await this.getTier(tierId);
        const patch: Record<string, any> = {};
        const hasCol = async (col: string) => this.knex.schema.hasColumn('subscription_tiers', col);

        if (dto.name !== undefined && (await hasCol('name'))) {
            patch.name = String(dto.name);
        }
        if (dto.price !== undefined && (await hasCol('price'))) {
            patch.price = Number(dto.price);
        }
        // Prefer badge; fall back to tagline column if badge is absent
        if (dto.badge !== undefined || dto.tagline !== undefined) {
            const value = dto.badge !== undefined ? dto.badge : dto.tagline;
            if (await hasCol('badge')) {
                patch.badge = value == null ? null : String(value);
            } else if (await hasCol('tagline')) {
                patch.tagline = value == null ? null : String(value);
            }
        }
        if (dto.description !== undefined && (await hasCol('description'))) {
            patch.description = dto.description == null ? null : String(dto.description);
        }
        if (dto.features !== undefined && (await hasCol('features'))) {
            patch.features = Array.isArray(dto.features)
                ? JSON.stringify(dto.features)
                : typeof dto.features === 'string'
                  ? dto.features
                  : JSON.stringify([]);
        }
        if (dto.is_active !== undefined && (await hasCol('is_active'))) {
            patch.is_active = Boolean(dto.is_active);
        }
        if (await hasCol('updated_at')) {
            patch.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        if (Object.keys(patch).length > 0) {
            await this.knex('subscription_tiers').where({ id: tierId }).update(patch);
        }
        const row = await this.knex('subscription_tiers').where({ id: tierId }).first();
        return this.mapTier(row);
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
        currency?: string;
        payment_method?: string;
    }) {
        const tier = await this.getTier(data.tier_id);
        if (tier.price === 0) throw new BadRequestException('Free tiers do not require payment');

        const proofUrl = String(data.proof_url || '').trim();
        if (!proofUrl) {
            throw new BadRequestException(
                'Payment proof file is required / Preuve de paiement requise',
            );
        }

        return SubscriptionPayment.query(this.knex).insertAndFetch({
            user_id: data.user_id,
            tier_id: data.tier_id,
            amount: data.amount,
            currency: data.currency || 'USD',
            payment_method: data.payment_method || 'Virement Bancaire',
            proof_url: proofUrl,
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
        let query = this.knex('subscription_payments')
            .leftJoin('users', 'subscription_payments.user_id', 'users.id')
            .leftJoin('subscription_tiers', 'subscription_payments.tier_id', 'subscription_tiers.id')
            .select(
                'subscription_payments.*',
                'users.name as user_name',
                'users.email as user_email',
                'users.phone as user_phone',
                'subscription_tiers.name as tier_name',
                'subscription_tiers.price as tier_price'
            )
            .orderBy('subscription_payments.created_at', 'desc');

        if (status && status !== 'all') query = query.where('subscription_payments.status', status);
        return query;
    }

    async reviewPayment(id: number, reviewerId: number, decision: 'approved' | 'rejected', adminMessage?: string) {
        const payment = await SubscriptionPayment.query(this.knex).findById(id);
        if (!payment) throw new NotFoundException('Payment not found');
        if (payment.status !== 'pending') throw new BadRequestException('Payment already reviewed');

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const patchData: any = {
            status: decision,
            reviewed_by: reviewerId,
            reviewed_at: now,
        };
        if (adminMessage !== undefined) {
            patchData.admin_message = adminMessage;
        }
        const updated = await SubscriptionPayment.query(this.knex).patchAndFetchById(id, patchData);

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

            // Immediately upgrade client account in users table
            try {
                const hasTierCol = await this.knex.schema.hasColumn('users', 'subscription_tier_id');
                if (hasTierCol) {
                    await this.knex('users').where('id', payment.user_id).update({
                        subscription_tier_id: payment.tier_id,
                    });
                }
            } catch (uErr) {
                console.warn('Could not update users subscription_tier_id:', uErr);
            }

            // Log activity
            try {
                const hasAct = await this.knex.schema.hasTable('activities');
                if (hasAct) {
                    await this.knex('activities').insert({
                        user_id: reviewerId,
                        type: 'subscriptions',
                        description: `Approved payment #${payment.id} and automatically upgraded User #${payment.user_id} to Tier #${payment.tier_id}`,
                        created_at: new Date(),
                    });
                }
            } catch {}
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
        try {
            if (!userId || userId >= 900000) {
                const fallbackLimits: any = {};
                const resKeys = ['trees', 'gallery', 'audios', 'documents', 'individuals', 'sources', 'notes', 'tasks'];
                for (const k of resKeys) {
                    fallbackLimits[k] = { used: 0, max: -1, custom: false };
                }
                return { userId, tierId: 3, tierName: 'Super Admin (Unlimited)', isSuperAdmin: true, limits: fallbackLimits };
            }

            const user = await this.knex('users').where({ id: userId }).first();
            if (!user) throw new NotFoundException('User not found');

            const roleId = Number(user.role_id ?? user.roleId ?? user.role ?? 2);
            const isSuperAdmin = roleId === 3 || roleId === 1;

            if (isSuperAdmin) {
                const fallbackLimits: any = {};
                const resKeys = ['trees', 'gallery', 'audios', 'documents', 'individuals', 'sources', 'notes', 'tasks'];
                for (const k of resKeys) {
                    fallbackLimits[k] = { used: 0, max: -1, custom: false };
                }
                return { userId, tierId: 3, tierName: 'Super Admin (Unlimited)', isSuperAdmin: true, limits: fallbackLimits };
            }

            const sub = await UserSubscription.query(this.knex)
                .where({ user_id: userId, status: 'active' })
                .orderBy('created_at', 'desc')
                .first();
            const tierId = sub ? (sub as any).tier_id : 1;
            const tier = await this.knex('subscription_tiers').where({ id: tierId }).first();

            const resources = ['trees', 'gallery', 'audios', 'documents', 'individuals', 'sources', 'notes', 'tasks'] as const;
            const result: Record<string, { used: number; max: number; custom: boolean }> = {};

            for (const res of resources) {
                let limit = -1;
                let isCustom = false;
                const customCol = `custom_max_${res}`;
                const tierCol = `max_${res}`;

                if (user[customCol] !== null && user[customCol] !== undefined) {
                    limit = Number(user[customCol]);
                    isCustom = true;
                } else if (tier && tier[tierCol] !== null && tier[tierCol] !== undefined) {
                    limit = Number(tier[tierCol]);
                } else {
                    const defaults: Record<string, number> = { trees: 25, gallery: 25, audios: 25, documents: 25, individuals: 25, sources: 25, notes: 25, tasks: 25 };
                    limit = defaults[res] ?? 25;
                }

                let currentCount = 0;
                try {
                    if (res === 'trees') {
                        const row = await this.knex('family_trees').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'gallery') {
                        const row = await this.knex('gallery').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'audios') {
                        const row = await this.knex('audios').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'documents') {
                        const row = await this.knex('documents').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'individuals') {
                        const row = await this.knex('individuals').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'sources') {
                        const row = await this.knex('sources').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'notes') {
                        const row = await this.knex('notes').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    } else if (res === 'tasks') {
                        const row = await this.knex('tasks').where({ user_id: userId }).count('id as cnt').first().catch(() => ({ cnt: 0 }));
                        currentCount = Number(row?.cnt || 0);
                    }
                } catch (subErr) {
                    currentCount = 0;
                }

                result[res] = { used: currentCount, max: limit, custom: isCustom };
            }

            return { userId, tierId, tierName: tier?.name || 'Basic', isSuperAdmin: false, limits: result };
        } catch (err) {
            console.error('Error in getUserQuotas:', err);
            const fallbackLimits: any = {};
            const resKeys = ['trees', 'gallery', 'audios', 'documents', 'individuals', 'sources', 'notes', 'tasks'];
            for (const k of resKeys) {
                fallbackLimits[k] = { used: 0, max: -1, custom: false };
            }
            return { userId, tierId: 3, tierName: 'Super Admin (Unlimited)', isSuperAdmin: true, limits: fallbackLimits };
        }
    }

    async checkUserQuota(userId: number, resource: 'trees' | 'gallery' | 'audios' | 'documents' | 'individuals' | 'sources' | 'notes' | 'tasks') {
        if (!userId || userId >= 900000) return;
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

    async updateTierLimits(tierId: number, limits: { max_trees?: number; max_gallery?: number; max_audios?: number; max_documents?: number; max_individuals?: number; max_sources?: number; max_notes?: number; max_tasks?: number }) {
        await this.getTier(tierId);
        const patch: any = {};
        if (limits.max_trees !== undefined) patch.max_trees = limits.max_trees;
        if (limits.max_gallery !== undefined) patch.max_gallery = limits.max_gallery;
        if (limits.max_audios !== undefined) patch.max_audios = limits.max_audios;
        if (limits.max_documents !== undefined) patch.max_documents = limits.max_documents;
        if (limits.max_individuals !== undefined) patch.max_individuals = limits.max_individuals;
        if (limits.max_sources !== undefined) patch.max_sources = limits.max_sources;
        if (limits.max_notes !== undefined) patch.max_notes = limits.max_notes;
        if (limits.max_tasks !== undefined) patch.max_tasks = limits.max_tasks;

        await this.knex('subscription_tiers').where({ id: tierId }).update(patch);
        return this.knex('subscription_tiers').where({ id: tierId }).first();
    }

    async updateUserLimits(userId: number, limits: { custom_max_trees?: number | null; custom_max_gallery?: number | null; custom_max_audios?: number | null; custom_max_documents?: number | null; custom_max_individuals?: number | null; custom_max_sources?: number | null; custom_max_notes?: number | null; custom_max_tasks?: number | null }) {
        const user = await this.knex('users').where({ id: userId }).first();
        if (!user) throw new NotFoundException('User not found');
        const patch: any = {};
        if (limits.custom_max_trees !== undefined) patch.custom_max_trees = limits.custom_max_trees;
        if (limits.custom_max_gallery !== undefined) patch.custom_max_gallery = limits.custom_max_gallery;
        if (limits.custom_max_audios !== undefined) patch.custom_max_audios = limits.custom_max_audios;
        if (limits.custom_max_documents !== undefined) patch.custom_max_documents = limits.custom_max_documents;
        if (limits.custom_max_individuals !== undefined) patch.custom_max_individuals = limits.custom_max_individuals;
        if (limits.custom_max_sources !== undefined) patch.custom_max_sources = limits.custom_max_sources;
        if (limits.custom_max_notes !== undefined) patch.custom_max_notes = limits.custom_max_notes;
        if (limits.custom_max_tasks !== undefined) patch.custom_max_tasks = limits.custom_max_tasks;

        await this.knex('users').where({ id: userId }).update(patch);
        return this.getUserQuotas(userId);
    }

        // ==========================================
    // CURRENCIES & EXCHANGE RATES (TAUX DE CHANGE)
    // ==========================================
    private currenciesReady = false;
    private async ensureCurrenciesSchema() {
        if (this.currenciesReady) return;
        try {
            if (!(await this.knex.schema.hasTable('currencies'))) {
                await this.knex.schema.createTable('currencies', (t: any) => {
                    t.increments('id').primary();
                    t.string('code', 10).notNullable().unique();
                    t.string('name', 100).notNullable();
                    t.string('symbol', 15).notNullable().defaultTo('$');
                    t.decimal('rate', 14, 4).notNullable().defaultTo(1.0);
                    t.boolean('is_base').notNullable().defaultTo(false);
                    t.boolean('is_active').notNullable().defaultTo(true);
                    t.timestamp('created_at').defaultTo(this.knex.fn.now());
                    t.timestamp('updated_at').defaultTo(this.knex.fn.now());
                });
                await this.knex('currencies').insert([
                    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, is_base: true, is_active: true },
                    { code: 'TND', name: 'Dinar Tunisien', symbol: 'DT', rate: 3.15, is_base: false, is_active: true },
                    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, is_base: false, is_active: true },
                    { code: 'GBP', name: 'Livre Sterling', symbol: '£', rate: 0.79, is_base: false, is_active: true },
                    { code: 'CAD', name: 'Dollar Canadien', symbol: 'CA$', rate: 1.38, is_base: false, is_active: true },
                    { code: 'SAR', name: 'Riyal Saoudien', symbol: 'SAR', rate: 3.75, is_base: false, is_active: true },
                ]);
            }
        } catch {}
        this.currenciesReady = true;
    }

    async listCurrencies(onlyActive = true) {
        await this.ensureCurrenciesSchema();
        try {
            let q = this.knex('currencies').select('*').orderBy('is_base', 'desc').orderBy('code', 'asc');
            if (onlyActive) q = q.where('is_active', true);
            const items = await q;
            if (items && items.length > 0) return items;
        } catch {}
        return [
            { id: 1, code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, is_base: true, is_active: true },
            { id: 2, code: 'TND', name: 'Dinar Tunisien', symbol: 'DT', rate: 3.15, is_base: false, is_active: true },
            { id: 3, code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, is_base: false, is_active: true },
            { id: 4, code: 'GBP', name: 'Livre Sterling', symbol: '£', rate: 0.79, is_base: false, is_active: true },
            { id: 5, code: 'CAD', name: 'Dollar Canadien', symbol: 'CA$', rate: 1.38, is_base: false, is_active: true },
            { id: 6, code: 'SAR', name: 'Riyal Saoudien', symbol: 'SAR', rate: 3.75, is_base: false, is_active: true },
        ];
    }

    async addCurrency(data: { code: string; name?: string; symbol?: string; rate: number; is_base?: boolean }) {
        await this.ensureCurrenciesSchema();
        const code = String(data.code || '').trim().toUpperCase();
        if (!code) throw new BadRequestException('Currency code abbreviation is required (e.g., TND, USD, EUR)');
        const rate = Number(data.rate) > 0 ? Number(data.rate) : 1.0;
        const now = this.knex.fn.now();

        const existing = await this.knex('currencies').where({ code }).first();
        if (existing) {
            await this.knex('currencies').where({ id: existing.id }).update({
                name: data.name || existing.name,
                symbol: data.symbol || existing.symbol,
                rate,
                is_active: true,
                updated_at: now,
            });
            return this.knex('currencies').where({ id: existing.id }).first();
        }

        const [id] = await this.knex('currencies').insert({
            code,
            name: data.name || code,
            symbol: data.symbol || code,
            rate,
            is_base: Boolean(data.is_base),
            is_active: true,
            created_at: now,
            updated_at: now,
        });

        return this.knex('currencies').where({ id }).first();
    }

    async updateCurrency(id: number, data: { name?: string; symbol?: string; rate?: number; is_active?: boolean; is_base?: boolean }) {
        await this.ensureCurrenciesSchema();
        const updateData: any = { updated_at: this.knex.fn.now() };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.symbol !== undefined) updateData.symbol = data.symbol;
        if (data.rate !== undefined) updateData.rate = Number(data.rate);
        if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active);
        if (data.is_base !== undefined) updateData.is_base = Boolean(data.is_base);

        await this.knex('currencies').where({ id }).update(updateData);
        return this.knex('currencies').where({ id }).first();
    }

    async deleteCurrency(id: number) {
        await this.ensureCurrenciesSchema();
        const curr = await this.knex('currencies').where({ id }).first();
        if (curr?.is_base) throw new BadRequestException('Base currency cannot be deleted');
        await this.knex('currencies').where({ id }).delete();
        return { success: true };
    }

    // ==========================================
    // PAYMENT METHODS (SUPER ADMIN CONTROLLED)
    // ==========================================
    private paymentMethodsReady = false;
    private async ensurePaymentMethodsSchema() {
        if (this.paymentMethodsReady) return;
        try {
            if (!(await this.knex.schema.hasTable('payment_methods'))) {
                await this.knex.schema.createTable('payment_methods', (t: any) => {
                    t.increments('id').primary();
                    t.string('code', 50).notNullable().unique();
                    t.string('name', 150).notNullable();
                    t.text('account_details').nullable();
                    t.text('instructions').nullable();
                    t.string('fee_note', 150).nullable();
                    t.string('badge', 100).nullable();
                    t.boolean('is_active').notNullable().defaultTo(true);
                    t.integer('sort_order').notNullable().defaultTo(0);
                    t.timestamp('created_at').defaultTo(this.knex.fn.now());
                    t.timestamp('updated_at').defaultTo(this.knex.fn.now());
                });
                await this.knex('payment_methods').insert([
                    {
                        code: 'bank_transfer',
                        name: 'Virement Bancaire (RIB / IBAN)',
                        account_details: 'Banque: BIAT / Attijari Bank Tunisie\nRIB: 0800 1234 5678 9012 3456\nIBAN: TN59 0800 1234 5678 9012 3456\nBénéficiaire: Roots Tunisia',
                        instructions: 'Veuillez effectuer votre virement bancaire puis saisir la référence de transaction.',
                        fee_note: 'Sans frais supplémentaires',
                        badge: 'Recommandé en Tunisie',
                        is_active: true,
                        sort_order: 1,
                    },
                    {
                        code: 'flouci_konnect',
                        name: 'Flouci / Konnect (Paiement Électronique & Mobile)',
                        account_details: 'Portefeuille Flouci: +961 36 26 082',
                        instructions: 'Payez via votre application mobile Flouci ou Konnect.',
                        fee_note: 'Validation instantanée',
                        badge: 'Paiement Rapide',
                        is_active: true,
                        sort_order: 2,
                    },
                    {
                        code: 'd17_postal',
                        name: 'Mandat D17 / La Poste Tunisienne',
                        account_details: 'Compte CCP: 1700 1234 5678 90\nNuméro D17: +961 36 26 082',
                        instructions: 'Effectuez le paiement via l\'application D17 ou dans un bureau de poste.',
                        fee_note: 'Accessible partout en Tunisie',
                        badge: 'La Poste',
                        is_active: true,
                        sort_order: 3,
                    },
                ]);
            }
        } catch {}
        this.paymentMethodsReady = true;
    }

    async listPaymentMethods(onlyActive = true) {
        await this.ensurePaymentMethodsSchema();
        try {
            let q = this.knex('payment_methods').select('*').orderBy('sort_order', 'asc');
            if (onlyActive) q = q.where('is_active', true);
            const methods = await q;
            if (methods && methods.length > 0) return methods;
        } catch {}
        return [
            {
                id: 1,
                code: 'bank_transfer',
                name: 'Virement Bancaire (RIB / IBAN)',
                account_details: 'Banque: BIAT / Attijari Bank Tunisie\nRIB: 0800 1234 5678 9012 3456\nIBAN: TN59 0800 1234 5678 9012 3456\nBénéficiaire: Roots Tunisia',
                instructions: 'Veuillez effectuer votre virement bancaire puis saisir la référence de transaction.',
                fee_note: 'Sans frais supplémentaires',
                badge: 'Recommandé en Tunisie',
                is_active: true,
                sort_order: 1,
            },
            {
                id: 2,
                code: 'flouci_konnect',
                name: 'Flouci / Konnect (Paiement Électronique & Mobile)',
                account_details: 'Portefeuille Flouci: +961 36 26 082',
                instructions: 'Payez via votre application mobile Flouci ou Konnect.',
                fee_note: 'Validation instantanée',
                badge: 'Paiement Rapide',
                is_active: true,
                sort_order: 2,
            },
            {
                id: 3,
                code: 'd17_postal',
                name: 'Mandat D17 / La Poste Tunisienne',
                account_details: 'Compte CCP: 1700 1234 5678 90\nNuméro D17: +961 36 26 082',
                instructions: 'Effectuez le paiement via l\'application D17 ou dans un bureau de poste.',
                fee_note: 'Accessible partout en Tunisie',
                badge: 'La Poste',
                is_active: true,
                sort_order: 3,
            },
        ];
    }

    async addPaymentMethod(data: {
        code?: string;
        name: string;
        account_details?: string;
        instructions?: string;
        fee_note?: string;
        badge?: string;
        sort_order?: number;
    }) {
        await this.ensurePaymentMethodsSchema();
        const code = String(data.code || `method_${Date.now()}`).trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        const now = this.knex.fn.now();

        const [id] = await this.knex('payment_methods').insert({
            code,
            name: data.name,
            account_details: data.account_details || '',
            instructions: data.instructions || '',
            fee_note: data.fee_note || '',
            badge: data.badge || '',
            is_active: true,
            sort_order: Number(data.sort_order || 0),
            created_at: now,
            updated_at: now,
        });

        return this.knex('payment_methods').where({ id }).first();
    }

    async updatePaymentMethod(id: number, data: Partial<{
        name: string;
        account_details: string;
        instructions: string;
        fee_note: string;
        badge: string;
        is_active: boolean;
        sort_order: number;
    }>) {
        await this.ensurePaymentMethodsSchema();
        const updateData: any = { updated_at: this.knex.fn.now() };
        if (data.name !== undefined) updateData.name = data.name;
        if (data.account_details !== undefined) updateData.account_details = data.account_details;
        if (data.instructions !== undefined) updateData.instructions = data.instructions;
        if (data.fee_note !== undefined) updateData.fee_note = data.fee_note;
        if (data.badge !== undefined) updateData.badge = data.badge;
        if (data.is_active !== undefined) updateData.is_active = Boolean(data.is_active);
        if (data.sort_order !== undefined) updateData.sort_order = Number(data.sort_order);

        await this.knex('payment_methods').where({ id }).update(updateData);
        return this.knex('payment_methods').where({ id }).first();
    }

    async deletePaymentMethod(id: number) {
        await this.ensurePaymentMethodsSchema();
        await this.knex('payment_methods').where({ id }).delete();
        return { success: true };
    }
}
