import { Body, Controller, Get, Patch, Query, Request, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class ActivityController {
    constructor(private readonly activityService: ActivityService) { }

    @Get('activity')
    async getActivities(@Query('limit') limit: number) {
        return this.activityService.findAll(limit || 50);
    }

    @Get('my/activity')
    async getMyActivities(@Request() req, @Query('limit') limit: number) {
        return this.activityService.findMyActivity(req.user.id, limit || 50);
    }

    @Get('my/activity-settings')
    async getMyActivitySettings(@Request() req) {
        return this.activityService.getActivitySettings(req.user.id);
    }

    @Patch('my/activity-settings')
    async updateMyActivitySettings(@Body() body: { enabled: boolean }, @Request() req) {
        return this.activityService.setActivityLogging(req.user.id, Boolean(body.enabled));
    }
}
