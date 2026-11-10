import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe, Header } from '@nestjs/common';
import { SocialService } from './social.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('social')
export class SocialController {
    constructor(private readonly socialService: SocialService) {}

    @Get('interactions')
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    async getInteractions(@Query('mediaKey') mediaKey: string, @Request() req) {
        const userId = req.user?.id ? Number(req.user.id) : undefined;
        return this.socialService.getInteractions(mediaKey, userId);
    }

    @Get('counts')
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    async getBatchCounts(@Query('keys') keysStr: string, @Request() req) {
        const keys = String(keysStr || '').split(',').map(s => s.trim()).filter(Boolean);
        const userId = req.user?.id ? Number(req.user.id) : undefined;
        return this.socialService.getBatchCounts(keys, userId);
    }

    @Post('likes')
    @UseGuards(JwtAuthGuard)
    async toggleLike(@Body() body: { mediaKey: string; entityType?: string; entityId?: number }, @Request() req) {
        return this.socialService.toggleLike(body.mediaKey, req.user.id, body.entityType, body.entityId);
    }

    @Post('comments')
    @UseGuards(JwtAuthGuard)
    async addComment(@Body() body: { mediaKey: string; content?: string; text?: string; entityType?: string; entityId?: number }, @Request() req) {
        const text = body.content || body.text || '';
        const userName = req.user.fullName || req.user.full_name || req.user.email || 'Member';
        return this.socialService.addComment(body.mediaKey, req.user.id, userName, text, body.entityType, body.entityId);
    }

    @Delete('comments/:id')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const userRole = Number(req.user?.role_id ?? req.user?.roleId ?? req.user?.role ?? 0);
        return this.socialService.deleteComment(id, req.user.id, userRole);
    }

    // Admin routes for moderation
    @Get('admin/comments')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    @Header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    async listAllComments(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        return this.socialService.listAllComments(Number(page || 1), Number(limit || 50), search);
    }

    @Delete('admin/comments/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async adminDeleteComment(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const userRole = Number(req.user?.role_id ?? req.user?.roleId ?? req.user?.role ?? 0);
        return this.socialService.deleteComment(id, req.user.id, userRole);
    }
}
