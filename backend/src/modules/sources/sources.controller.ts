import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SourcesService } from './sources.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `source-icon-${uniqueSuffix}${extname(file.originalname)}`);
    },
});

@Controller()
export class SourcesController {
    constructor(
        private readonly sourcesService: SourcesService,
        private readonly subscriptionsService: SubscriptionsService,
    ) {}

    @Get('my/sources')
    @UseGuards(JwtAuthGuard)
    async getMySources(@Req() req: any) {
        return this.sourcesService.listByUser(req.user.id);
    }

    @Post('my/sources')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', { storage }))
    async createSource(
        @Req() req: any,
        @Body() body: { title: string; url?: string; description?: string; icon_url?: string },
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (!body.title || !body.title.trim()) {
            throw new BadRequestException('Source title is required');
        }

        // Quota check: user cannot exceed max_sources
        await this.subscriptionsService.checkUserQuota(req.user.id, 'sources');

        let iconUrl = body.icon_url || '';
        if (file) {
            iconUrl = `/uploads/${file.filename}`;
        }

        return this.sourcesService.create(req.user.id, {
            title: body.title.trim(),
            url: body.url || '',
            description: body.description || '',
            icon_url: iconUrl,
        });
    }

    @Put('my/sources/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', { storage }))
    async updateSource(
        @Req() req: any,
        @Param('id') id: string,
        @Body() body: { title?: string; url?: string; description?: string; icon_url?: string },
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let iconUrl = body.icon_url;
        if (file) {
            iconUrl = `/uploads/${file.filename}`;
        }

        return this.sourcesService.update(parseInt(id, 10), req.user.id, {
            title: body.title,
            url: body.url,
            description: body.description,
            icon_url: iconUrl,
        });
    }

    @Delete('my/sources/:id')
    @UseGuards(JwtAuthGuard)
    async deleteSource(@Req() req: any, @Param('id') id: string) {
        return this.sourcesService.delete(parseInt(id, 10), req.user.id);
    }

    @Get('admin/sources')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async getAdminSources() {
        return this.sourcesService.listAll();
    }
}
