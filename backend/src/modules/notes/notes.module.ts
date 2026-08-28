import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { MulterModule } from '@nestjs/platform-express';
import { GALLERY_UPLOADS_DIR } from '../../common/utils/file.utils';
import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

@Module({
    imports: [
        SubscriptionsModule,
        MulterModule.register({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, GALLERY_UPLOADS_DIR);
                },
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname || '');
                    cb(null, `note-${crypto.randomBytes(16).toString('hex')}${ext}`);
                },
            }),
            limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
            fileFilter: (req, file, cb) => {
                const allowedTypes = /jpeg|jpg|png|gif|webp/;
                const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = allowedTypes.test(file.mimetype);
                if (mimetype && extname) {
                    return cb(null, true);
                }
                cb(new Error('Only image files are allowed!'), false);
            }
        })
    ],
    controllers: [NotesController],
    providers: [NotesService],
    exports: [NotesService],
})
export class NotesModule {}