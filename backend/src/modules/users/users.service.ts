import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { User } from '../../models/User';
import { Book } from '../../models/Book';
import { Tree } from '../../models/Tree';
import { Gallery } from '../../models/Gallery';
import { ActivityLog } from '../../models/ActivityLog';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ActivityService } from '../activity/activity.service';
import { MailerService } from '../../common/mailer/mailer.service';

@Injectable()
export class UsersService {
    constructor(
        @Inject('KnexConnection') private readonly knex,
        private readonly activityService: ActivityService,
        private readonly mailerService: MailerService,
    ) { }

    private parsePrivileges(value: any): string[] {
        if (!value) return [];
        if (Array.isArray(value)) return value.map((v) => String(v));
        try {
            const parsed = JSON.parse(String(value));
            return Array.isArray(parsed) ? parsed.map((v) => String(v)) : [];
        } catch {
            return String(value)
                .split(',')
                .map((v) => v.trim())
                .filter(Boolean);
        }
    }

    private serializePrivileges(value: any): string | null {
        if (value === undefined) return undefined as any;
        if (value === null) return null;
        if (!Array.isArray(value)) return null;
        const cleaned = value.map((v) => String(v).trim()).filter(Boolean);
        return cleaned.length ? JSON.stringify(cleaned) : null;
    }

    private mapUserRow(row: any) {
        const roleId = Number(row.roleId ?? row.role_id ?? row.role ?? 0);
        const privileges = this.parsePrivileges(
            row.privileges ?? row.adminPrivileges ?? row.admin_privileges,
        );
        return {
            ...row,
            role: roleId,
            roleId,
            role_id: roleId,
            phone: row.phone ?? row.phoneNumber ?? row.phone_number ?? null,
            privileges,
            permissions: privileges,
            adminPrivileges: privileges,
        };
    }

    async findAll() {
        return User.query(this.knex)
            .select(
                'users.id',
                'users.full_name as fullName',
                'users.phone_number as phoneNumber',
                'users.email',
                'users.role_id as roleId',
                'users.status',
                'users.admin_privileges as adminPrivileges',
                'users.created_at as createdAt',
                'users.last_login as lastLogin',
                'role.name as roleName'
            )
            .joinRelated('role')
            .orderBy('users.created_at', 'desc')
            .limit(100)
            .then((rows) => rows.map((row: any) => this.mapUserRow(row)));
    }

    async findOne(id: number) {
        const row = await this.knex('users')
            .select(
                'users.id',
                'users.full_name as fullName',
                'users.phone_number as phoneNumber',
                'users.email',
                'users.role_id',
                'users.role_id as roleId',
                'users.status',
                'users.admin_privileges as adminPrivileges',
                'users.created_at as createdAt',
                'users.last_login as lastLogin',
                'roles.name as roleName'
            )
            .leftJoin('roles', 'users.role_id', 'roles.id')
            .where('users.id', id)
            .first();

        if (!row) throw new NotFoundException('User not found');
        return this.mapUserRow(row);
    }

    async findByEmail(email: string) {
        return User.query(this.knex).findOne({ email });
    }

    async create(data: any, adminId: number | null) {
        const existing = await this.findByEmail(data.email);
        if (existing) throw new BadRequestException('Email already registered');

        const providedPassword = data.password != null ? String(data.password) : '';
        let passwordHash: string;
        if (providedPassword) {
            if (providedPassword.length < 6) {
                throw new BadRequestException('Password must be at least 6 characters');
            }
            passwordHash = await bcrypt.hash(providedPassword, 10);
        } else if (adminId != null) {
            // Admin creating regular user without password: generate temporary password
            const randomPassword = crypto.randomBytes(24).toString('hex');
            passwordHash = await bcrypt.hash(randomPassword, 10);
        } else {
            throw new BadRequestException('Password must be at least 6 characters');
        }

        const privileges = this.serializePrivileges(data.privileges);
        const insertPayload: Record<string, any> = {
            full_name: data.fullName || data.full_name,
            phone_number: data.phone || data.phoneNumber || data.phone_number || null,
            email: data.email,
            password: passwordHash,
            role_id: data.roleId ?? data.role_id ?? 2,
            status: 'active',
        };
        if (privileges !== undefined) {
            insertPayload.admin_privileges = privileges;
        }

        const newUser = await User.query(this.knex).insertAndFetch(insertPayload);

        if (adminId != null) {
            await this.activityService.log(adminId, 'users', `Created user: ${data.email}`);
        } else {
            await this.activityService.log(newUser.id, 'users', `Signed up: ${data.email}`);
        }

        return this.findOne(newUser.id);
    }

    async update(id: number, data: any, adminId: number) {
        const user = await User.query(this.knex).findById(id);
        if (!user) throw new NotFoundException('User not found');

        const updateData: any = {};
        if (data.fullName !== undefined) updateData.full_name = data.fullName;
        if (data.full_name !== undefined) updateData.full_name = data.full_name;

        if (data.phone !== undefined) updateData.phone_number = data.phone;
        if (data.phoneNumber !== undefined) updateData.phone_number = data.phoneNumber;
        if (data.phone_number !== undefined) updateData.phone_number = data.phone_number;

        if (data.email !== undefined) updateData.email = data.email;

        if (data.roleId !== undefined) updateData.role_id = data.roleId;
        if (data.role_id !== undefined) updateData.role_id = data.role_id;

        if (data.status !== undefined) updateData.status = data.status;

        if (data.privileges !== undefined) {
            updateData.admin_privileges = this.serializePrivileges(data.privileges);
        }

        if (data.password) {
            if (String(data.password).length < 6) {
                throw new BadRequestException('Password must be at least 6 characters');
            }
            updateData.password = await bcrypt.hash(String(data.password), 10);
        }

        await User.query(this.knex).patch(updateData).where('id', id);
        await this.activityService.log(adminId, 'users', `Updated user #${id}`);

        return this.findOne(id);
    }

    async delete(id: number, adminId: number) {
        if (Number(id) === Number(adminId)) {
            throw new BadRequestException('You cannot delete your own account');
        }

        const user = await User.query(this.knex).findById(id);
        if (!user) throw new NotFoundException('User not found');

        if (Number(user.role_id) === 3) {
            const superAdminCount = await User.query(this.knex)
                .where('role_id', 3)
                .resultSize();
            if (superAdminCount <= 1) {
                throw new BadRequestException('Cannot delete the last super admin');
            }
        }

        // Transactional deletion
        await User.transaction(this.knex, async (trx) => {
            await Book.query(trx).patch({ uploaded_by: null }).where('uploaded_by', id);
            await Tree.query(trx).patch({ user_id: null }).where('user_id', id);
            await Gallery.query(trx).patch({ uploaded_by: null }).where('uploaded_by', id);
            await ActivityLog.query(trx).patch({ actor_user_id: null }).where('actor_user_id', id);

            // Delete password resets if table exists model
            await trx('password_resets').delete().where('email', user.email);

            await User.query(trx).deleteById(id);
        });

        await this.activityService.log(adminId, 'users', `Deleted user #${id}`);

        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Account Deleted - Roots Tunisia',
                text: `Hello ${(user as any).full_name || (user as any).fullName || ''},\n\nYour account on Roots Tunisia has been deleted. If you have any questions, please contact support at devteam@rootstunisia.com.\n\n- Roots Tunisia Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h2 style="color: #991b1b;">Account Deleted</h2>
                        <p>Hello ${(user as any).full_name || (user as any).fullName || 'User'},</p>
                        <p>Your account on <strong>Roots Tunisia</strong> has been deleted by an administrator.</p>
                        <p>If you believe this was done in error or if you have questions, please contact our support team at <a href="mailto:devteam@rootstunisia.com">devteam@rootstunisia.com</a>.</p>
                        <br>
                        <p>- Roots Tunisia Team</p>
                    </div>
                `,
            });
        } catch (err: any) {
            console.error('Failed to send account deletion email:', err?.message || err);
        }

        return { message: 'User deleted' };
    }

    async changePassword(userId: number, currentPass: string, newPass: string) {
        if (!newPass || newPass.length < 6) {
            throw new BadRequestException('New password must be at least 6 characters');
        }
        const user = await this.knex('users').where({ id: userId }).first();
        if (!user) throw new NotFoundException('User not found');

        if (user.password) {
            const isValid = await bcrypt.compare(currentPass || '', user.password);
            if (!isValid) throw new BadRequestException('Incorrect current password');
        }

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await this.knex('users').where({ id: userId }).update({ password: hashedPassword });
        await this.activityService.log(userId, 'auth', 'Changed password');
        return { message: 'Password updated successfully' };
    }

    async requestAccountDeletion(userId: number, reason?: string) {
        const user = await this.knex('users').where({ id: userId }).first();
        if (!user) throw new NotFoundException('User not found');

        if (await this.knex.schema.hasTable('account_deletion_requests')) {
            await this.knex('account_deletion_requests').insert({
                user_id: userId,
                reason: reason || 'Self requested deletion from user settings dashboard',
                requested_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                status: 'pending'
            });
        }
        await this.activityService.log(userId, 'auth', 'Requested account deletion');
        return { message: 'Account deletion request submitted to Super Admin.' };
    }

    async selfDeleteAccount(userId: number, passwordConfirm: string, reason?: string) {
        const user = await this.knex('users').where({ id: userId }).first();
        if (!user) throw new NotFoundException('User not found');

        if (user.password) {
            const isValid = await bcrypt.compare(passwordConfirm || '', user.password);
            if (!isValid) throw new BadRequestException('Incorrect password confirmation. Account deletion aborted.');
        }

        // Full cascading deletion of user personal data
        await User.transaction(this.knex, async (trx) => {
            // Remove user personal content
            await trx('notes').where({ user_id: userId }).delete();
            await trx('task_comments').where({ user_id: userId }).delete();
            await trx('tasks').where({ user_id: userId }).delete();
            await trx('reminders').where({ user_id: userId }).delete();
            await trx('user_sources').where({ user_id: userId }).delete();
            await trx('download_requests').where({ user_id: userId }).delete();
            if (await trx.schema.hasTable('account_deletion_requests')) {
                await trx('account_deletion_requests').where({ user_id: userId }).delete();
            }
            await trx('refresh_tokens').where({ user_id: userId }).delete();
            await trx('password_resets').where({ email: user.email }).delete();
            await trx('newsletter_subscribers').where({ email: user.email }).delete();

            // Handle family trees & associated individuals
            const trees = await trx('family_trees').where({ user_id: userId }).select('id');
            const treeIds = trees.map((t: any) => t.id);
            if (treeIds.length > 0) {
                if (await trx.schema.hasTable('person_links')) {
                    await trx('person_links').whereIn('person_id', trx('persons').select('id').whereIn('tree_id', treeIds)).delete();
                }
                if (await trx.schema.hasTable('persons')) {
                    await trx('persons').whereIn('tree_id', treeIds).delete();
                }
                if (await trx.schema.hasTable('individuals')) {
                    await trx('individuals').whereIn('tree_id', treeIds).delete();
                }
                await trx('family_trees').whereIn('id', treeIds).delete();
            }

            // Anonymize shared contributions (books/gallery uploaded)
            await trx('books').where({ uploaded_by: userId }).update({ uploaded_by: null });
            await trx('gallery').where({ uploaded_by: userId }).update({ uploaded_by: null });
            await trx('documents').where({ uploaded_by: userId }).update({ uploaded_by: null });
            await trx('audios').where({ uploaded_by: userId }).update({ uploaded_by: null });
            await trx('activity_logs').where({ actor_user_id: userId }).update({ actor_user_id: null });

            // Finally remove the user account record
            await trx('users').where({ id: userId }).delete();
        });

        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Account and Personal Data Erased - Roots Tunisia',
                text: `Hello ${user.full_name || 'User'},\n\nYour Roots Tunisia account and associated personal data have been completely deleted as requested in accordance with applicable privacy regulations.\n\nThank you for using Roots Tunisia.`,
            });
        } catch {}

        return { message: 'Your account and personal data have been completely deleted.' };
    }

    async sendUserEmail(to: string, subject: string, body: string, adminId?: number) {
        if (!to || !subject || !body) {
            throw new BadRequestException('Recipient email, subject, and body are required');
        }
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #d4af37; border-radius: 12px; background: #fffcf7;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="color: #1f160f; margin: 0; font-family: serif;">جذور تونس | Roots Tunisia</h2>
                    <p style="color: #d4af37; font-size: 13px; margin: 4px 0 0 0;">منصة التوثيق والأنساب والأرشيف التاريخي</p>
                </div>
                <div style="line-height: 1.6; color: #333; font-size: 15px; white-space: pre-line;">
                    ${body}
                </div>
                <hr style="border: none; border-top: 1px solid #e0d8c3; margin: 30px 0 15px 0;" />
                <div style="text-align: center; font-size: 12px; color: #777;">
                    <p style="margin: 0;">هذه الرسالة مرسلة من فريق إدارة منصة جذور تونس عبر خادم SMTP.</p>
                    <p style="margin: 4px 0 0 0;">© ${new Date().getFullYear()} Roots Tunisia. All rights reserved.</p>
                </div>
            </div>
        `;
        await this.mailerService.sendMail({
            to,
            subject,
            html,
            text: body,
        });
        if (adminId) {
            try {
                await this.activityService.log(adminId, 'users', `Sent email to ${to}: "${subject}"`);
            } catch {}
        }
        return { success: true, message: 'Email sent successfully via SMTP' };
    }

    private async assertSuperAdmin(actorId: number) {
        const actor = await User.query(this.knex).findById(actorId);
        if (!actor || Number(actor.role_id) !== 3) {
            throw new ForbiddenException('Only super admin can manage admins');
        }
        return actor;
    }

    async findAdmins() {
        const rows = await this.findAll();
        return rows.filter((u: any) => {
            const roleId = Number(u.roleId ?? u.role ?? 0);
            return roleId === 1 || roleId === 3;
        });
    }

    async createAdmin(data: any, superAdminId: number) {
        await this.assertSuperAdmin(superAdminId);

        const password = data.password != null ? String(data.password) : '';
        if (!password || password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters');
        }

        const requestedRole = Number(data.roleId ?? data.role_id ?? data.role ?? 1);
        const roleId = requestedRole === 3 ? 3 : 1;

        return this.create(
            {
                ...data,
                password,
                roleId,
                role_id: roleId,
                privileges: Array.isArray(data.privileges) ? data.privileges : [],
            },
            superAdminId,
        );
    }

    async updateAdmin(id: number, data: any, superAdminId: number) {
        await this.assertSuperAdmin(superAdminId);

        const target = await this.findOne(id);
        const targetRole = Number(target.roleId ?? target.role ?? 0);
        if (targetRole === 3) {
            throw new ForbiddenException('Cannot edit super admin through admin manager');
        }
        if (targetRole !== 1) {
            throw new BadRequestException('Target user is not an admin');
        }

        const updatePayload: any = {
            ...data,
            roleId: 1,
            role_id: 1,
        };
        if (data.privileges !== undefined) {
            updatePayload.privileges = Array.isArray(data.privileges) ? data.privileges : [];
        }

        return this.update(id, updatePayload, superAdminId);
    }
}
