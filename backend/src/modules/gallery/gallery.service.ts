import { Injectable, Inject, NotFoundException, ForbiddenException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { Gallery } from '../../models/Gallery';
import { ActivityService } from '../activity/activity.service';
import { resolveStoredFilePath, safeUnlink } from '../../common/utils/file.utils';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GalleryService implements OnModuleInit {
    constructor(
        @Inject('KnexConnection') private readonly knex,
        private readonly activityService: ActivityService,
    ) { }

    async onModuleInit() {
        try {
            if (!(await this.knex.schema.hasTable('gallery'))) return;
            if (!(await this.knex.schema.hasColumn('gallery', 'image_data'))) {
                await this.knex.schema.alterTable('gallery', (t: any) => t.specificType('image_data', 'LONGBLOB').nullable());
            }
            if (!(await this.knex.schema.hasColumn('gallery', 'image_mime_type'))) {
                await this.knex.schema.alterTable('gallery', (t: any) => t.string('image_mime_type', 120).nullable());
            }
            if (!(await this.knex.schema.hasColumn('gallery', 'book_id'))) {
                await this.knex.schema.alterTable('gallery', (t: any) => t.integer('book_id').unsigned().nullable());
            }
            if (!(await this.knex.schema.hasColumn('gallery', 'tree_id'))) {
                await this.knex.schema.alterTable('gallery', (t: any) => t.integer('tree_id').unsigned().nullable());
            }
            await this.backfillImageData();
        } catch (err: any) {
            console.warn(`Gallery file-backup init skipped: ${err?.message || err}`);
        }
    }

    private mimeForPath(p: string): string {
        const ext = path.extname(p).toLowerCase();
        const map: Record<string, string> = {
            '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
            '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.avif': 'image/avif',
        };
        return map[ext] || 'application/octet-stream';
    }

    private async backfillImageData() {
        const rows = await this.knex('gallery')
            .select('id', 'image_path')
            .whereNotNull('image_path')
            .andWhere((b: any) => b.whereNull('image_data').orWhere('image_data', ''));
        for (const row of rows) {
            try {
                const fp = resolveStoredFilePath(row.image_path);
                if (fp && fs.existsSync(fp)) {
                    await this.knex('gallery').where('id', row.id).update({
                        image_data: fs.readFileSync(fp),
                        image_mime_type: this.mimeForPath(fp),
                    });
                }
            } catch (err: any) {
                console.warn(`Gallery backfill skipped for #${row.id}: ${err?.message || err}`);
            }
        }
    }

    async listPublic() {
        return Gallery.query(this.knex)
            .select('id', 'title', 'description', 'category', 'image_path', 'is_public', 'location', 'year', 'photographer', 'seed_key', 'show_details', 'uploaded_by', 'created_at', 'updated_at')
            .where('is_public', true)
            .orderBy('created_at', 'desc')
            .withGraphFetched('uploader')
            .modifyGraph('uploader', (builder) => builder.select('id', 'full_name'));
    }

    async getPublic(id: number) {
        const item = await Gallery.query(this.knex)
            .findById(id)
            .where('is_public', true)
            .withGraphFetched('uploader')
            .modifyGraph('uploader', (builder) => builder.select('id', 'full_name'));

        if (!item) throw new NotFoundException('Not found');
        return item;
    }

    async listByUser(userId: number) {
        return Gallery.query(this.knex)
            .select('id', 'title', 'description', 'category', 'image_path', 'is_public', 'location', 'year', 'photographer', 'seed_key', 'show_details', 'uploaded_by', 'created_at', 'updated_at')
            .where('uploaded_by', userId)
            .orderBy('created_at', 'desc');
    }

    async listAdmin() {
        return Gallery.query(this.knex)
            .select('id', 'title', 'description', 'category', 'image_path', 'is_public', 'location', 'year', 'photographer', 'seed_key', 'show_details', 'uploaded_by', 'created_at', 'updated_at')
            .orderBy('created_at', 'desc')
            .withGraphFetched('uploader')
            .modifyGraph('uploader', (builder: any) => builder.select('id', 'full_name', 'email'));
    }

    async findOne(id: number) {
        const item = await Gallery.query(this.knex).findById(id).withGraphFetched('uploader');
        if (!item) throw new NotFoundException('Gallery item not found');
        return item;
    }

    async create(data: any, userId: number, file: Express.Multer.File) {
        if (!data.title || !file) {
            throw new BadRequestException('Title and image are required');
        }

        const isPublic = data.isPublic === 'true' || data.isPublic === true;
        const filename = file.filename || `${Date.now()}-${(file.originalname || 'photo.webp').replace(/[^\w.-]+/g, '_')}`;
        const targetDir = path.join(process.cwd(), 'uploads/gallery');
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, filename);

        let imageData: Buffer;
        if (file.buffer) {
            imageData = file.buffer;
            fs.writeFileSync(targetPath, file.buffer);
        } else if (file.path && fs.existsSync(file.path)) {
            imageData = fs.readFileSync(file.path);
        } else {
            imageData = Buffer.from([]);
        }

        const imagePath = `/uploads/gallery/${filename}`;

        const newItem = await Gallery.query(this.knex).insertAndFetch({
            title: data.title,
            description: data.description || '',
            image_path: imagePath,
            image_data: imageData,
            image_mime_type: file.mimetype || this.mimeForPath(file.originalname || imagePath),
            uploaded_by: userId,
            is_public: isPublic,
            archive_source: data.archiveSource || null,
            document_code: data.documentCode || null,
            location: data.location || null,
            year: data.year || null,
            photographer: data.photographer || null,
            book_id: data.bookId || data.book_id || null,
            tree_id: data.treeId || data.tree_id || null,
        });

        await this.activityService.log(userId, 'gallery', `Created gallery item: ${data.title}`);
        return newItem;
    }

    async update(id: number, data: any, userId: number, userRole: number, file: Express.Multer.File) {
        const item = await this.findOne(id);

        const roleId = Number(userRole ?? 0);
        const isAdmin = roleId === 1 || roleId === 3;
        const isOwner = item.uploaded_by === userId;
        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('Forbidden');
        }

        const updateData: any = {};
        if (data.title) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.archiveSource !== undefined) updateData.archive_source = data.archiveSource;
        if (data.documentCode !== undefined) updateData.document_code = data.documentCode;
        if (data.location !== undefined) updateData.location = data.location;
        if (data.year !== undefined) updateData.year = data.year;
        if (data.photographer !== undefined) updateData.photographer = data.photographer;

        const isPublic = data.isPublic !== undefined
            ? (data.isPublic === 'true' || data.isPublic === true || data.isPublic === 1)
            : !!item.is_public;
        updateData.is_public = Boolean(isPublic);

        if (file) {
            const filename = file.filename || `${Date.now()}-${(file.originalname || 'photo.webp').replace(/[^\w.-]+/g, '_')}`;
            const targetDir = path.join(process.cwd(), 'uploads/gallery');
            if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
            const targetPath = path.join(targetDir, filename);

            let imageData: Buffer;
            if (file.buffer) {
                imageData = file.buffer;
                fs.writeFileSync(targetPath, file.buffer);
            } else if (file.path && fs.existsSync(file.path)) {
                imageData = fs.readFileSync(file.path);
            } else {
                imageData = Buffer.from([]);
            }

            if (item.image_path) safeUnlink(resolveStoredFilePath(item.image_path));
            updateData.image_path = `/uploads/gallery/${filename}`;
            updateData.image_data = imageData;
            updateData.image_mime_type = file.mimetype || this.mimeForPath(file.originalname || filename);
        }

        await Gallery.query(this.knex).patch(updateData).where('id', id);
        await this.activityService.log(userId, 'gallery', `Updated gallery item: ${item.title}`);

        return { id };
    }

    async delete(id: number, userId: number, userRole: number) {
        const item = await this.findOne(id);

        const roleId = Number(userRole ?? 0);
        const isAdmin = roleId === 1 || roleId === 3;
        const isOwner = item.uploaded_by === userId;
        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('Forbidden');
        }

        if (item.image_path) safeUnlink(resolveStoredFilePath(item.image_path));

        await Gallery.query(this.knex).deleteById(id);
        await this.activityService.log(userId, 'gallery', `Deleted gallery item: ${item.title}`);

        return { message: 'Deleted' };
    }
}
