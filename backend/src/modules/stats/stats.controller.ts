import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
export class StatsController {
    constructor(private readonly statsService: StatsService) { }

    @Get('admin/stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin', 1, 3)
    async getStats() {
        return this.statsService.getStats();
    }

    @Get('my/stats')
    @UseGuards(JwtAuthGuard)
    async getMyStats(@Request() req: any) {
        const userId = req.user?.id || req.user?.userId;
        return this.statsService.getUserStats(userId);
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard)
    async getDynamicStats(@Request() req: any) {
        const user = req.user;
        const roleId = Number(user?.role_id ?? user?.roleId ?? user?.role ?? 0);
        const roleName = String(user?.roleName ?? user?.role_name ?? '').toLowerCase().trim();
        const isAdmin = roleId === 1 || roleId === 3 || roleName === 'admin' || roleName === 'super_admin';

        if (isAdmin) {
            return this.statsService.getStats();
        }
        return this.statsService.getUserStats(user?.id || user?.userId);
    }
}
