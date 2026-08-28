import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RefreshToken } from '../../models/RefreshToken';
import { ActivityService } from '../activity/activity.service';
import * as crypto from 'crypto';

import { MailerService } from '../../common/mailer/mailer.service';

export type SeedAdmin = {
    id: number;
    email: string;
    password: string;
    fullName: string;
    roleId: number;
};

export const SEED_ADMINS: SeedAdmin[] = [
    {
        id: 900001,
        email: 'karimadmin@rootstunisia.com',
        password: 'admin2025$',
        fullName: 'Karim Admin',
        roleId: 3,
    },
    {
        id: 900002,
        email: 'kameladmin@rootstunisia.com',
        password: 'vivreplusfort18041972SS',
        fullName: 'Kamel Admin',
        roleId: 3,
    },
    {
        id: 900003,
        email: 'devteam@rootstunisia.com',
        password: 'admin2025$',
        fullName: 'Dev Team Admin',
        roleId: 3,
    },
    {
        id: 900004,
        email: 'marcousorilious@gmail.com',
        password: 'admin2025$',
        fullName: 'Marcous Orilious Admin',
        roleId: 3,
    },
    {
        id: 900005,
        email: 'admin@rootstunisia.com',
        password: 'admin2025$',
        fullName: 'Administrator',
        roleId: 3,
    },
    {
        id: 900006,
        email: 'superadmin@rootstunisia.com',
        password: 'admin2025$',
        fullName: 'Super Administrator',
        roleId: 3,
    },
];

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private activityService: ActivityService,
        private mailerService: MailerService,
        @Inject('KnexConnection') private readonly knex: any,
    ) { }

    private isDatabaseUnavailable(error: unknown) {
        const message = error instanceof Error ? error.message : String((error as any) || '');
        const code = (error as any)?.code || '';
        return (
            code === 'ENOTFOUND' ||
            code === 'ECONNREFUSED' ||
            code === 'ETIMEDOUT' ||
            message.includes('getaddrinfo') ||
            message.includes('ECONNREFUSED') ||
            message.includes('ETIMEDOUT')
        );
    }

    private getSeedAdmins(): SeedAdmin[] {
        const adminDefaults = [
            { id: 900001, prefix: 'SEED_ADMIN', email: 'karimadmin@rootstunisia.com', password: 'admin2025$', fullName: 'Karim Admin', roleId: 3 },
            { id: 900002, prefix: 'SEED_ADMIN2', email: 'kameladmin@rootstunisia.com', password: 'vivreplusfort18041972SS', fullName: 'Kamel Admin', roleId: 3 },
            { id: 900003, prefix: 'SEED_ADMIN3', email: 'devteam@rootstunisia.com', password: 'admin2025$', fullName: 'Dev Team Admin', roleId: 3 },
            { id: 900004, prefix: 'SEED_ADMIN4', email: 'marcousorilious@gmail.com', password: 'admin2025$', fullName: 'Marcous Orilious Admin', roleId: 3 },
            { id: 900005, prefix: 'SEED_ADMIN5', email: 'admin@rootstunisia.com', password: 'admin2025$', fullName: 'Administrator', roleId: 3 },
            { id: 900006, prefix: 'SEED_ADMIN6', email: 'superadmin@rootstunisia.com', password: 'admin2025$', fullName: 'Super Administrator', roleId: 3 },
        ];

        return adminDefaults.map((admin) => ({
            id: admin.id,
            email: (process.env[`${admin.prefix}_EMAIL`] || admin.email).toLowerCase().trim(),
            password: process.env[`${admin.prefix}_PASSWORD`] || admin.password,
            fullName: process.env[`${admin.prefix}_FULL_NAME`] || admin.fullName,
            roleId: Number(process.env[`${admin.prefix}_ROLE_ID`] || admin.roleId),
        }));
    }

    private getSeedAdmin(email: string, password: string) {
        const admins = this.getSeedAdmins();
        return admins.find(
            (admin) => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password,
        );
    }

    private toSeedAdminUser(admin: SeedAdmin) {
        return {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            full_name: admin.fullName,
            role_id: admin.roleId,
            roleId: admin.roleId,
            roleName: admin.roleId === 3 ? 'super_admin' : 'admin',
            status: 'active',
            permissions: ['all'],
            seedAdmin: true,
        };
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const normalizedEmail = String(email ?? '').trim().toLowerCase();
        try {
            const user = await this.usersService.findByEmail(normalizedEmail);
            if (user && user.password && (await bcrypt.compare(pass, user.password))) {
                const status = String(user.status || 'active').toLowerCase();
                if (['pending', 'unvalidated'].includes(status)) {
                    throw new ForbiddenException('Your account is pending validation');
                }
                if (status === 'rejected' || status === 'banned') {
                    throw new ForbiddenException('Your account is not allowed to log in');
                }
                const { password, ...result } = user;
                return result;
            }
            // If user not in DB, try seed admin credentials
            const seedAdmin = this.getSeedAdmin(normalizedEmail, pass);
            if (seedAdmin) {
                return this.toSeedAdminUser(seedAdmin);
            }
            return null;
        } catch (error) {
            if (!this.isDatabaseUnavailable(error)) {
                // If it's a seed admin, allow login even on error
                const seedAdmin = this.getSeedAdmin(normalizedEmail, pass);
                if (seedAdmin) return this.toSeedAdminUser(seedAdmin);
                throw error;
            }

            const seedAdmin = this.getSeedAdmin(normalizedEmail, pass);
            if (!seedAdmin) throw error;
            return this.toSeedAdminUser(seedAdmin);
        }
    }

    async login(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role_id || user.roleId || 1,
            roleId: user.role_id || user.roleId || 1,
            fullName: user.fullName || user.full_name,
            roleName: (user.role_id === 3 || user.roleId === 3) ? 'super_admin' : 'admin',
            seedAdmin: Boolean(user.seedAdmin),
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        if (user.seedAdmin) {
            return {
                token: accessToken,
                refreshToken,
                user: {
                    ...user,
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName || user.full_name,
                    roleId: user.role_id || user.roleId || 1,
                },
            };
        }

        try {
            // Store refresh token in DB if available
            await RefreshToken.query(this.knex).insert({
                token: refreshToken,
                user_id: user.id,
                expires_at: expiresAt.toISOString().slice(0, 19).replace('T', ' '),
            });
            await this.activityService.log(user.id, 'security', `User logged in: ${user.email}`);
        } catch (err) {
            console.warn('Could not persist refresh token or activity log:', err);
        }

        // Use validated user data directly without redundant DB roundtrip
        const fullUser = {
            id: user.id,
            email: user.email,
            fullName: user.fullName || user.full_name,
            phoneNumber: user.phone_number || user.phoneNumber || null,
            roleId: user.role_id || user.roleId || 1,
            role_id: user.role_id || user.roleId || 1,
            roleName: user.roleName || ((user.role_id === 3 || user.roleId === 3) ? 'super_admin' : 'admin'),
            status: user.status || 'active',
            createdAt: user.created_at || user.createdAt,
            lastLogin: user.last_login || user.lastLogin,
        };

        return {
            token: accessToken,
            refreshToken,
            user: fullUser,
        };
    }

    async signup(data: any) {
        const payload = { ...data, full_name: data.full_name ?? data.fullName };
        const user = await this.usersService.create(payload, null);
        return this.login(user);
    }

    async refreshToken(token: string) {
        if (!token || typeof token !== 'string') {
            throw new UnauthorizedException('Refresh token is required');
        }

        let user: any = null;
        try {
            const decoded = this.jwtService.decode(token) as any;
            if (decoded && (decoded.seedAdmin || decoded.sub >= 900000 || decoded.email)) {
                const seedAdmin = SEED_ADMINS.find(
                    (a) => a.id === Number(decoded.sub) || a.email.toLowerCase() === String(decoded.email || '').toLowerCase()
                );
                if (seedAdmin) {
                    user = this.toSeedAdminUser(seedAdmin);
                }
            }
        } catch {}

        if (!user) {
            try {
                const storedToken = await RefreshToken.query(this.knex)
                    .findOne({ token })
                    .withGraphFetched('user');

                if (storedToken && new Date(storedToken.expires_at) >= new Date() && storedToken.user) {
                    user = storedToken.user;
                    await RefreshToken.query(this.knex).deleteById(storedToken.id);
                }
            } catch (e) {
                console.warn('Refresh token query warning:', e);
            }
        }

        if (!user) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role_id || user.roleId || 1,
            roleId: user.role_id || user.roleId || 1,
            fullName: user.fullName || user.full_name,
            roleName: (user.role_id === 3 || user.roleId === 3) ? 'super_admin' : 'admin',
            seedAdmin: Boolean(user.seedAdmin),
        };

        const newRefreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        try {
            await RefreshToken.query(this.knex).insert({
                token: newRefreshToken,
                user_id: user.id,
                expires_at: expiresAt.toISOString().slice(0, 19).replace('T', ' '),
            });
        } catch {}

        return {
            token: this.jwtService.sign(payload),
            refreshToken: newRefreshToken,
            user,
        };
    }

    async logout(userId: number) {
        try {
            await RefreshToken.query(this.knex).delete().where('user_id', userId);
            await this.activityService.log(userId, 'security', 'User logged out');
        } catch {}
        return { message: 'Logged out' };
    }

    async requestReset(email: string) {
        const normalized = String(email ?? '').trim().toLowerCase();
        if (!normalized) {
            throw new BadRequestException('Email is required');
        }
        const user = await this.usersService.findByEmail(normalized);
        if (!user) return { message: 'If the email exists, a reset code will be sent.' };
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();
        const codeHash = await bcrypt.hash(code, 10);
        await this.knex('password_resets').del().where('email', normalized);
        await this.knex('password_resets').insert({
            email: normalized,
            code_hash: codeHash,
            expires_at: this.knex.raw('DATE_ADD(NOW(), INTERVAL 15 MINUTE)'),
        });

        try {
            await this.mailerService.sendMail({
                to: normalized,
                subject: 'Roots Tunisia - Password Reset Code',
                text: `Hello ${(user as any).full_name || (user as any).fullName || ''},\n\nYour password reset code for Roots Tunisia is: ${code}.\n\nThis code expires in 15 minutes.`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                        <h2 style="color: #134E4A; margin-bottom: 16px;">Roots Tunisia Password Reset</h2>
                        <p>Hello ${(user as any).full_name || (user as any).fullName || 'User'},</p>
                        <p>You requested a password reset for your account at Roots Tunisia.</p>
                        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; margin: 24px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #0d1b2a;">${code}</span>
                        </div>
                        <p>Enter this verification code on the password reset page to set a new password. This code will expire in 15 minutes.</p>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">If you did not request this, please ignore this email.</p>
                    </div>
                `,
            });
        } catch (err: any) {
            console.error('Failed to send reset email:', err?.message || err);
        }

        return { message: 'If the email exists, a reset code will be sent.', code: process.env.NODE_ENV === 'development' ? code : undefined };
    }

    async verifyReset(email: string, code: string, newPassword: string) {
        const normalizedEmail = String(email ?? '').trim().toLowerCase();
        const trimmedCode = String(code ?? '').trim();
        const pass = String(newPassword ?? '');

        if (!normalizedEmail || !trimmedCode || !pass) {
            throw new BadRequestException('Email, code, and new password are required');
        }
        if (pass.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters');
        }
        const row = await this.knex('password_resets')
            .where('email', normalizedEmail)
            .where('expires_at', '>', this.knex.fn.now())
            .first();
        if (!row) {
            await this.knex('password_resets').del().where('email', normalizedEmail);
            throw new BadRequestException('Invalid or expired reset code');
        }
        const valid = await bcrypt.compare(trimmedCode, row.code_hash);
        if (!valid) throw new BadRequestException('Invalid reset code');

        const hashedPassword = await bcrypt.hash(pass, 10);
        await this.knex('users').where({ email: normalizedEmail }).update({ password: hashedPassword });
        await this.knex('password_resets').del().where('email', normalizedEmail);
        return { message: 'Password has been reset successfully' };
    }
}
