import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { PeriodsService } from "./periods.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller()
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  // =========================================================================
  // PUBLIC ENDPOINTS
  // =========================================================================

  @Get("periods/config")
  async getPeriodsConfig() {
    return this.periodsService.getCmsJson("periods_cms_config");
  }

  @Get("help-center/config")
  async getHelpCenterConfig() {
    return this.periodsService.getCmsJson("help_center_cms_config");
  }

  @Get("periods/stats")
  async getStats() {
    return this.periodsService.getSourcesStats();
  }

  @Get("periods/available-sources")
  async getAvailableSources(
    @Query("search") search?: string,
    @Query("type") type?: string,
  ) {
    return this.periodsService.getAllAvailableSources(search, type);
  }

  @Get("periods/:periodId/sources")
  async getPeriodSources(@Param("periodId") periodId: string) {
    return this.periodsService.getSourcesByPeriod(periodId);
  }

  // =========================================================================
  // ADMIN ENDPOINTS (Roles 1 & 3 / admin & super_admin)
  // =========================================================================

  @Put("admin/periods/config")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "super_admin", 1, 3)
  async savePeriodsConfig(@Body() body: any, @Request() req: any) {
    return this.periodsService.saveCmsJson("periods_cms_config", body, req.user?.id);
  }

  @Put("admin/help-center/config")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "super_admin", 1, 3)
  async saveHelpCenterConfig(@Body() body: any, @Request() req: any) {
    return this.periodsService.saveCmsJson("help_center_cms_config", body, req.user?.id);
  }

  @Post("admin/periods/:periodId/sources")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "super_admin", 1, 3)
  async linkSource(
    @Param("periodId") periodId: string,
    @Body()
    body: {
      source_type: string;
      source_id: number | string;
      custom_title?: string;
      custom_notes?: string;
    },
  ) {
    return this.periodsService.linkSource(periodId, body);
  }

  @Delete("admin/periods/sources/:linkId")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "super_admin", 1, 3)
  async unlinkSource(@Param("linkId", ParseIntPipe) linkId: number) {
    return this.periodsService.unlinkSource(linkId);
  }
}

