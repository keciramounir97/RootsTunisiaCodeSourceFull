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

    async findAll() {
        return User.query(this.knex)
            .select(
                'users.id',
                'users.full_name as fullName',
                'users.phone_number as phoneNumber',
                'users.email',
                'users.role_id as roleId',
                'users.status',
                'users.created_at as createdAt',
                'users.last_login as lastLogin',
                'role.name as roleName'
            )
            .joinRelated('role')
            .orderBy('users.created_at', 'desc')
            .limit(100);
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
                'users.created_at as createdAt',
                'users.last_login as lastLogin',
                'roles.name as roleName'
            )
            .leftJoin('roles', 'users.role_id', 'roles.id')
            .where('users.id', id)
            .first();

        if (!row) throw new NotFoundException('User not found');
        // Ensure role_id/roleId for guards (some expect role_id, some roleId)
        row.role_id = row.role_id ?? row.roleId;
        row.roleId = row.roleId ?? row.role_id;
        return row;
    }

    async findByEmail(email: string) {
        return User.query(this.knex).findOne({ email });
    }

    async create(data: any, adminId: number | null) {
        const existing = await this.findByEmail(data.email);
        if (existing) throw new BadRequestException('Email already registered');

        let passwordHash: string;
        if (adminId != null) {
            // Admin creating user: generate random password (user must reset)
            const randomPassword = crypto.randomBytes(24).toString('hex');
            passwordHash = await bcrypt.hash(randomPassword, 10);
        } else {
            // Self-signup: use provided password
            if (!data.password || String(data.password).length < 6) {
                throw new BadRequestException('Password must be at least 6 characters');
            }
            passwordHash = await bcrypt.hash(data.password, 10);
        }

        const newUser = await User.query(this.knex).insertAndFetch({
            full_name: data.fullName || data.full_name,
            phone_number: data.phone || data.phoneNumber || data.phone_number || null,
            email: data.email,
            password: passwordHash,
            role_id: data.roleId ?? data.role_id ?? 2,
            status: 'active',
        });

        if (adminId != null) {
            await this.activityService.log(adminId, 'users', `Created user: ${data.email}`);
        } else {
            await this.activityService.log(newUser.id, 'users', `Signed up: ${data.email}`);
        }

        return newUser;
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

        if (data.roleId !== undefined) updateData.role_id = data.roleId;
        if (data.role_id !== undefined) updateData.role_id = data.role_id;

        if (data.status !== undefined) updateData.status = data.status;

        await User.query(this.knex).patch(updateData).where('id', id);
        await this.activityService.log(adminId, 'users', `Updated user #${id}`);

        return { message: 'User updated' };
    }

    async delete(id: number, adminId: number) {
        if (Number(id) === Number(adminId)) {
            throw new BadRequestException('You cannot delete your own account');
        }

        const user = await User.query(this.knex).findById(id);
        if (!user) throw new NotFoundException('User not found');

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
}
