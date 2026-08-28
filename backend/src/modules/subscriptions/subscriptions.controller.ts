import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
export class SubscriptionsController {
    constructor(private readonly service: SubscriptionsService) {}

    @Get('subscriptions/tiers')
    async listTiers() {
        return this.service.listTiers();
    }

    @Get('subscriptions/tiers/:id')
    async getTier(@Param('id', ParseIntPipe) id: number) {
        return this.service.getTier(id);
    }

    @Get('subscriptions/tiers/:id/access')
    async getPageAccess(@Param('id', ParseIntPipe) id: number) {
        return this.service.getPageAccess(id);
    }

    @Get('my/subscription')
    @UseGuards(JwtAuthGuard)
    async getMySubscription(@Request() req) {
        return this.service.getUserSubscription(req.user.id);
    }

    @Post('my/subscription')
    @UseGuards(JwtAuthGuard)
    async createMySubscription(@Body() body: { tier_id: number }, @Request() req) {
        const userId: number = Number(req.user.id);
        return this.service.createSubscription({ user_id: userId, tier_id: body.tier_id });
    }

    @Post('my/subscription/:id/cancel')
    @UseGuards(JwtAuthGuard)
    async cancelMySubscription(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.service.cancelSubscription(id, req.user.id);
    }

    // ===== PAYMENT ENDPOINTS =====

    @Get('payment-settings')
    @UseGuards(JwtAuthGuard)
    async getPaymentSettings() {
        return this.service.getPaymentSettings();
    }

    @Post('my/subscription/payment')
    @UseGuards(JwtAuthGuard)
    async submitPayment(@Body() body: { tier_id: number; amount: number; proof_url?: string; notes?: string }, @Request() req) {
        return this.service.submitPayment({ ...body, user_id: req.user.id });
    }

    @Get('my/subscription/payments')
    @UseGuards(JwtAuthGuard)
    async listMyPayments(@Request() req) {
        return this.service.listMyPayments(req.user.id);
    }

    // ===== ADMIN ENDPOINTS =====

    @Get('admin/subscriptions')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async listAll() {
        return this.service.listAllSubscriptions();
    }

    @Get('admin/subscription-payments')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async listAllPayments(@Query('status') status?: string) {
        return this.service.listAllPayments(status);
    }

    @Patch('admin/subscription-payments/:id/review')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async reviewPayment(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { decision: 'approved' | 'rejected' },
        @Request() req,
    ) {
        return this.service.reviewPayment(id, req.user.id, body.decision);
    }

    @Patch('admin/users/:userId/subscription')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async upgradeUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() body: { tier_id: number },
        @Request() req,
    ) {
        return this.service.upgradeUserSubscription(userId, body.tier_id, req.user.id);
    }

    // ===== Tier feature flags (redesign parity) =====

    @Get('admin/subscription-tiers')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async listTiersForAdmin() {
        return this.service.listTiersForAdmin();
    }

    @Get('admin/subscription-tier-features')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async listTierFeatures() {
        return this.service.listTierFeatures();
    }

    @Post('admin/subscription-tier-features')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async createFeature(@Body() body: { featureKey: string; label: string }) {
        return this.service.createFeature(body.featureKey, body.label);
    }

    @Delete('admin/subscription-tier-features/:featureKey')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async deleteFeature(@Param('featureKey') featureKey: string) {
        return this.service.deleteFeature(featureKey);
    }

    @Put('admin/subscription-tier-features/:tierId/:featureKey')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async setTierFeature(
        @Param('tierId', ParseIntPipe) tierId: number,
        @Param('featureKey') featureKey: string,
        @Body() body: { enabled: boolean },
    ) {
        return this.service.setTierFeature(tierId, featureKey, body.enabled);
    }

    // ===== CREATION QUOTA LIMIT ENDPOINTS =====

    @Get('my/quotas')
    @UseGuards(JwtAuthGuard)
    async getMyQuotas(@Request() req) {
        return this.service.getUserQuotas(req.user.id);
    }

    @Get('admin/users/:userId/quotas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async getUserQuotasForAdmin(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.getUserQuotas(userId);
    }

    @Patch('admin/subscription-tiers/:id/limits')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async updateTierLimits(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: { max_trees?: number; max_gallery?: number; max_audios?: number; max_documents?: number; max_individuals?: number },
    ) {
        return this.service.updateTierLimits(id, body);
    }

    @Patch('admin/users/:userId/limits')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(3)
    async updateUserLimits(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() body: { custom_max_trees?: number | null; custom_max_gallery?: number | null; custom_max_audios?: number | null; custom_max_documents?: number | null; custom_max_individuals?: number | null },
    ) {
        return this.service.updateUserLimits(userId, body);
    }
}
