import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class TasksController {
    constructor(private readonly service: TasksService) {}

    @Get('my/tasks')
    @UseGuards(JwtAuthGuard)
    async listMy(@Request() req) {
        return this.service.listByUser(req.user.id);
    }

    @Post('my/tasks')
    @UseGuards(JwtAuthGuard)
    async createMy(@Body() body: any, @Request() req) {
        return this.service.create({ ...body, user_id: req.user.id });
    }

    @Patch('my/tasks/:id')
    @UseGuards(JwtAuthGuard)
    async updateMy(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req) {
        return this.service.update(id, body, req.user.id);
    }

    @Delete('my/tasks/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMy(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.service.delete(id, req.user.id);
    }

    @Get('my/tasks/:id/comments')
    @UseGuards(JwtAuthGuard)
    async getComments(@Param('id', ParseIntPipe) id: number) {
        return this.service.getComments(id);
    }

    @Post('my/tasks/:id/comments')
    @UseGuards(JwtAuthGuard)
    async addComment(@Param('id', ParseIntPipe) id: number, @Body() body: { content: string }, @Request() req) {
        return this.service.addComment(id, req.user.id, body.content);
    }

    @Get('admin/tasks')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async listAll() {
        return this.service.listAll();
    }

    @Post('admin/tasks')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    @UseInterceptors(FileInterceptor('image'))
    async adminCreate(@Body() body: any, @Request() req, @UploadedFile() file?: Express.Multer.File) {
        const data: any = {
            title: body.title,
            description: body.description,
            user_id: req.user.id,
            status: body.status || 'todo',
            priority: body.priority || 'medium'
        };
        if (file) {
            data.image_url = `/uploads/gallery/${file.filename}`;
        }
        return this.service.create(data);
    }

    @Patch('admin/tasks/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    @UseInterceptors(FileInterceptor('image'))
    async adminUpdate(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const updateData: any = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.status !== undefined) updateData.status = body.status;
        if (body.priority !== undefined) updateData.priority = body.priority;
        if (file) {
            updateData.image_url = `/uploads/gallery/${file.filename}`;
        }
        return this.service.adminUpdate(id, updateData);
    }

    @Delete('admin/tasks/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async adminDelete(@Param('id', ParseIntPipe) id: number) {
        return this.service.adminDelete(id);
    }
}