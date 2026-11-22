import {
    Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
    Request, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as multer from 'multer';
import * as path from 'path';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ADMIN_UPLOADS_DIR, WorkspaceService } from './workspace.service';

const imageUploadOptions = {
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            fs.mkdirSync(ADMIN_UPLOADS_DIR, { recursive: true });
            cb(null, ADMIN_UPLOADS_DIR);
        },
        filename: (_req, file, cb) => {
            const ext = path.extname(file.originalname || '');
            cb(null, `admin-${crypto.randomBytes(16).toString('hex')}${ext}`);
        },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
};

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) { }

    // ----- Admin notes -----

    @Get('admin/notes')
    listNotes() {
        return this.workspaceService.listNotes();
    }

    @Post('admin/notes')
    @UseInterceptors(FileInterceptor('image', imageUploadOptions))
    createNote(@Request() req, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
        return this.workspaceService.createNote(req.user.id, body, file);
    }

    @Patch('admin/notes/:id')
    @UseInterceptors(FileInterceptor('image', imageUploadOptions))
    updateNote(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.workspaceService.updateNote(id, body, file);
    }

    @Delete('admin/notes/:id')
    deleteNote(@Param('id', ParseIntPipe) id: number) {
        return this.workspaceService.deleteNote(id);
    }

    // ----- Admin tasks -----

    @Get('admin/tasks')
    listTasks() {
        return this.workspaceService.listTasks();
    }

    @Post('admin/tasks')
    @UseInterceptors(FileInterceptor('image', imageUploadOptions))
    createTask(@Request() req, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
        return this.workspaceService.createTask(req.user.id, body, file);
    }

    @Patch('admin/tasks/:id')
    @UseInterceptors(FileInterceptor('image', imageUploadOptions))
    updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        return this.workspaceService.updateTask(id, body, file);
    }

    @Delete('admin/tasks/:id')
    deleteTask(@Param('id', ParseIntPipe) id: number) {
        return this.workspaceService.deleteTask(id);
    }
}
