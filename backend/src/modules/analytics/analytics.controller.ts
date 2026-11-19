import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post("analytics/collect")
  async collect(@Body() body: any, @Req() req: any) {
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "";
    return this.analyticsService.collect({
      path: body?.path,
      title: body?.title,
      referrer: body?.referrer,
      locale: body?.locale,
      sessionId: body?.sessionId,
      userAgent: req.headers["user-agent"],
      ip,
    });
  }

  @Get("admin/analytics/live")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "super_admin", "1", "3")
  async live(@Query("minutes") minutes?: string) {
    const [live, ga] = await Promise.all([
      this.analyticsService.getLive(Number(minutes) || 30),
      this.analyticsService.getGaRealtime(),
    ]);
    return {
      live,
      googleAnalytics: ga,
      config: this.analyticsService.getGaConfigStatus(),
    };
  }

  @Get("admin/analytics/config")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin", "super_admin", "1", "3")
  async config() {
    return this.analyticsService.getGaConfigStatus();
  }
}
