import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as crypto from "crypto";
import * as multer from "multer";
import * as path from "path";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { SITE_CONTENT_UPLOADS_DIR } from "../../common/utils/file.utils";
import { SiteContentService } from "./site-content.service";

const ALLOWED_IMAGE_EXT = /^\.(jpe?g|png|gif|webp)$/;

const siteContentUploadOptions = {
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, SITE_CONTENT_UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase();
      cb(null, `sc-${crypto.randomBytes(16).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    const extOk = ALLOWED_IMAGE_EXT.test(path.extname(file.originalname || "").toLowerCase());
    const mimeOk = /^image\/(jpeg|jpg|png|gif|webp)$/.test(file.mimetype || "");
    if (extOk && mimeOk) return cb(null, true);
    return cb(
      new BadRequestException("Only jpg, png, gif or webp images are allowed"),
      false,
    );
  },
};

@Controller("admin/site-content")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin", "super_admin")
export class AdminSiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  getDocument() {
    return this.siteContentService.getDocument();
  }

  @Put()
  saveDocument(@Body() body: any, @Request() req) {
    return this.siteContentService.saveDocument(body, req.user.id);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("image", siteContentUploadOptions))
  upload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    return this.siteContentService.registerUpload(file, req.user.id);
  }
}

@Controller("site-content")
export class PublicSiteContentController {
  constructor(private readonly siteContentService: SiteContentService) {}

  @Get()
  @Header("Cache-Control", "public, max-age=30")
  getPublicContent() {
    return this.siteContentService.getPublicContent();
  }
}
