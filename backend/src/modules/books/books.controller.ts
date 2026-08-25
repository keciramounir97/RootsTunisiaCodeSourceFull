
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UseInterceptors, UploadedFiles, Res, NotFoundException, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { DownloadRequestsService } from '../download-requests/download-requests.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { getStoredFilePayload } from '../../common/utils/db-file.util';

@Controller()
export class BooksController {
    constructor(
        private readonly booksService: BooksService,
        private readonly downloadRequestsService: DownloadRequestsService,
        private readonly subscriptionsService: SubscriptionsService,
    ) { }

    // Public Routes
    @Get('books')
    async listPublic() {
        return this.booksService.listPublic();
    }

    @Get('books/:id')
    async getPublic(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.getPublic(id);
    }

    @Get('books/:id/download')
    @UseGuards(JwtAuthGuard)
    async downloadPublic(@Param('id', ParseIntPipe) id: number, @Request() req, @Res() res: Response) {
        const book = await this.booksService.getPublic(id);
        if (!book.is_public) throw new ForbiddenException('Not public');

        const userId = req.user?.id;
        const roleId = Number(req.user?.role_id ?? req.user?.roleId ?? req.user?.role ?? 0);
        const isOwner = book.uploaded_by != null && Number(book.uploaded_by) === Number(userId);
        const isAdmin = roleId === 1 || roleId === 3;
        if (!isOwner && !isAdmin) {
            const allowed =
                (await this.downloadRequestsService.hasApprovedAccess('book', id, userId)) ||
                (await this.subscriptionsService.hasFeature(userId, 'skip_download_requests'));
            if (!allowed) throw new ForbiddenException('Downloading this book requires an approved download request.');
        }

        const filePath = this.booksService.getFilePath(book);
        if (filePath && fs.existsSync(filePath)) {
            await this.booksService.incrementDownload(id);
            return res.download(filePath, path.basename(filePath));
        }
        // Disk file missing — fall back to the database backup copy.
        const stored = getStoredFilePayload(book as any, 'file_data', 'file_mime_type', 'file_path', 'application/octet-stream', 'book-download');
        if (stored) {
            await this.booksService.incrementDownload(id);
            return res.type(stored.mimeType).attachment(stored.filename).send(stored.data);
        }
        throw new NotFoundException('File not found');
    }

    // My Routes
    @Get('my/books')
    @UseGuards(JwtAuthGuard)
    async listMy(@Request() req) {
        return this.booksService.listByUser(req.user.id);
    }

    @Get('my/books/:id')
    @UseGuards(JwtAuthGuard)
    async getMy(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const book = await this.booksService.findOne(id);
        if (book.uploaded_by !== req.user.id) throw new ForbiddenException();
        return book;
    }

    @Post('my/books')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    async createMy(@Body() body: CreateBookDto, @Request() req, @UploadedFiles() files: { file?: Express.Multer.File[], cover?: Express.Multer.File[] }) {
        return this.booksService.create(body, req.user.id, files);
    }

    @Put('my/books/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    async updateMy(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto, @Request() req, @UploadedFiles() files: { file?: Express.Multer.File[], cover?: Express.Multer.File[] }) {
        const userRole = req.user?.role_id ?? req.user?.roleId ?? req.user?.role;
        return this.booksService.update(id, body, req.user.id, userRole, files);
    }

    @Delete('my/books/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMy(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const userRole = req.user?.role_id ?? req.user?.roleId ?? req.user?.role;
        return this.booksService.delete(id, req.user.id, userRole);
    }

    @Get('my/books/:id/download')
    @UseGuards(JwtAuthGuard)
    async downloadMy(@Param('id', ParseIntPipe) id: number, @Res() res: Response, @Request() req) {
        const book = await this.booksService.findOne(id);
        if (book.uploaded_by !== req.user.id) throw new ForbiddenException();

        const filePath = this.booksService.getFilePath(book);
        if (filePath && fs.existsSync(filePath)) {
            await this.booksService.incrementDownload(id);
            return res.download(filePath, path.basename(filePath));
        }
        // Disk file missing — fall back to the database backup copy.
        const stored = getStoredFilePayload(book as any, 'file_data', 'file_mime_type', 'file_path', 'application/octet-stream', 'book-download');
        if (stored) {
            await this.booksService.incrementDownload(id);
            return res.type(stored.mimeType).attachment(stored.filename).send(stored.data);
        }
        throw new NotFoundException('File not found');
    }

    // Admin Routes
    @Get('admin/books')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async listAdmin() {
        return this.booksService.listAdmin();
    }

    @Get('admin/books/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async getAdmin(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findOne(id);
    }

    @Post('admin/books')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    async createAdmin(@Body() body: CreateBookDto, @Request() req, @UploadedFiles() files: { file?: Express.Multer.File[], cover?: Express.Multer.File[] }) {
        return this.booksService.create(body, req.user.id, files);
    }

    @Put('admin/books/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    async updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateBookDto, @Request() req, @UploadedFiles() files: { file?: Express.Multer.File[], cover?: Express.Multer.File[] }) {
        const userRole = req.user?.role_id ?? req.user?.roleId ?? req.user?.role;
        return this.booksService.update(id, body, req.user.id, userRole, files);
    }

    @Delete('admin/books/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async deleteAdmin(@Param('id', ParseIntPipe) id: number, @Request() req) {
        const userRole = req.user?.role_id ?? req.user?.roleId ?? req.user?.role;
        return this.booksService.delete(id, req.user.id, userRole);
    }
}
