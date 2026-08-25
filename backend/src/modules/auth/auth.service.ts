import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RefreshToken } from '../../models/RefreshToken';
import { ActivityService } from '../activity/activity.service';
import * as crypto from 'crypto';

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
        roleId: 1,
    },
    {
        id: 900002,
        email: 'kameladmin@rootstunisia.com',
        password: 'vivreplusfort18041972SS',
        fullName: 'Kamel Admin',
        roleId: 1,
    },
    {
        id: 900003,
        email: 'devteam@rootstunisia.com',
        password: 'admin2025$',
        fullName: 'Dev Team Admin',
        roleId: 1,
    },
    {
        id: 900004,
        email: 'marcousorilious@gmail.com',
        password: 'admin2025$',
        fullName: 'Marcous Orilious Admin',
        roleId: 1,
    },
    {
        id: 900005,
        email: 'admin@rootstunisia.com',
        password: 'admin2025$',
        fullName: 'Administrator',
        roleId: 1,
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

    private getSeedAdmin(email: string, password: string) {
        return SEED_ADMINS.find(
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

        // Fetch full user data for response
        let fullUser = user;
        try {
            const fetched = await this.usersService.findOne(user.id);
            if (fetched) fullUser = fetched;
        } catch {}

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
        const storedToken = await RefreshToken.query(this.knex)
            .findOne({ token })
            .withGraphFetched('user');

        if (!storedToken || new Date(storedToken.expires_at) < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
        const user = storedToken.user;
        if (!user) {
            await RefreshToken.query(this.knex).deleteById(storedToken.id);
            throw new UnauthorizedException('User no longer exists');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role_id,
            roleId: user.role_id,
        };

        const newRefreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await RefreshToken.query(this.knex).deleteById(storedToken.id);
        await RefreshToken.query(this.knex).insert({
            token: newRefreshToken,
            user_id: user.id,
            expires_at: expiresAt.toISOString().slice(0, 19).replace('T', ' '),
        });

        return {
            token: this.jwtService.sign(payload),
            refreshToken: newRefreshToken,
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
        if (!user) return { message: 'If the email exists, a reset link will be sent.' };
        const code = crypto.randomBytes(6).toString('hex');
        const codeHash = await bcrypt.hash(code, 10);
        await this.knex('password_resets').del().where('email', normalized);
        await this.knex('password_resets').insert({
            email: normalized,
            code_hash: codeHash,
            expires_at: this.knex.raw('DATE_ADD(NOW(), INTERVAL 15 MINUTE)'),
        });
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
