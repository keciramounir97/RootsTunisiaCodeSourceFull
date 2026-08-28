import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class NotesController {
    constructor(private readonly service: NotesService) {}

    @Get('my/notes')
    @UseGuards(JwtAuthGuard)
    async listMy(@Request() req) {
        return this.service.listByUser(req.user.id);
    }

    @Post('my/notes')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async createMy(@Body() body: any, @Request() req, @UploadedFile() file?: Express.Multer.File) {
        const data: any = {
            title: body.title,
            content: body.content,
            user_id: req.user.id
        };
        if (file) {
            data.image_url = `/uploads/gallery/${file.filename}`;
        }
        return this.service.create(data);
    }

    @Patch('my/notes/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async updateMy(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @Request() req,
        @UploadedFile() file?: Express.Multer.File
    ) {
        const updateData: any = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.content !== undefined) updateData.content = body.content;
        if (file) {
            updateData.image_url = `/uploads/gallery/${file.filename}`;
        }
        return this.service.update(id, updateData, req.user.id);
    }

    @Delete('my/notes/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMy(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.service.delete(id, req.user.id);
    }

    @Get('admin/notes')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async listAll() {
        return this.service.listAll();
    }

    @Post('admin/notes')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    @UseInterceptors(FileInterceptor('image'))
    async adminCreate(@Body() body: any, @Request() req, @UploadedFile() file?: Express.Multer.File) {
        const data: any = {
            title: body.title,
            content: body.content,
            user_id: req.user.id
        };
        if (file) {
            data.image_url = `/uploads/gallery/${file.filename}`;
        }
        return this.service.create(data);
    }

    @Patch('admin/notes/:id')
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
        if (body.content !== undefined) updateData.content = body.content;
        if (file) {
            updateData.image_url = `/uploads/gallery/${file.filename}`;
        }
        return this.service.adminUpdate(id, updateData);
    }

    @Delete('admin/notes/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1, 3)
    async adminDelete(@Param('id', ParseIntPipe) id: number) {
        return this.service.adminDelete(id);
    }
}