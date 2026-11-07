import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import {
    AdminBannerSlidesController,
    AdminSiteImagesController,
    PublicBannerSlidesController,
    PublicSiteImagesController,
    SettingsController,
} from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
    imports: [ActivityModule],
    controllers: [
        SettingsController,
        PublicSiteImagesController,
        AdminSiteImagesController,
        PublicBannerSlidesController,
        AdminBannerSlidesController,
    ],
    providers: [SettingsService],
    exports: [SettingsService],
})
export class SettingsModule { }
