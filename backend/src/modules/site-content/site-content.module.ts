import { Module } from "@nestjs/common";
import { ActivityModule } from "../activity/activity.module";
import {
  AdminSiteContentController,
  PublicSiteContentController,
} from "./site-content.controller";
import { SiteContentService } from "./site-content.service";

@Module({
  imports: [ActivityModule],
  controllers: [AdminSiteContentController, PublicSiteContentController],
  providers: [SiteContentService],
  exports: [SiteContentService],
})
export class SiteContentModule {}
