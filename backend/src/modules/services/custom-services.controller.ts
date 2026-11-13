import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { CustomServicesService } from "./custom-services.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@Controller()
export class CustomServicesController {
  constructor(private readonly servicesService: CustomServicesService) {}

  // =========================================================================
  // PUBLIC ENDPOINTS
  // =========================================================================

  @Get("services")
  async listServices() {
    return this.servicesService.listPublishedServices();
  }

  @Get("services/:idOrSlug")
  async getService(@Param("idOrSlug") idOrSlug: string) {
    return this.servicesService.getServiceByIdOrSlug(idOrSlug);
  }

  @Post("services/bookings")
  async createBooking(
    @Body()
    body: {
      service_id: number;
      client_name: string;
      client_email: string;
      client_phone: string;
      client_message: string;
      target_ancestor?: string;
      urgency?: string;
      preferred_contact?: string;
    },
  ) {
    return this.servicesService.createBooking(body);
  }

  // =========================================================================
  // SUPER ADMIN ENDPOINTS (Roles 1 & 3)
  // =========================================================================

  @Get("admin/services")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  async adminListServices() {
    return this.servicesService.listAllServices();
  }

  @Post("admin/services")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async adminCreateService(@Body() body: any) {
    return this.servicesService.createService(body);
  }

  @Put("admin/services/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async adminUpdateService(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.servicesService.updateService(id, body);
  }

  @Delete("admin/services/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async adminDeleteService(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.deleteService(id);
  }

  @Get("admin/services-bookings")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  async adminListBookings(
    @Query("service_id") serviceId?: string,
    @Query("status") status?: string,
  ) {
    return this.servicesService.listBookings({
      service_id: serviceId ? Number(serviceId) : undefined,
      status,
    });
  }

  @Put("admin/services-bookings/:id/status")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(1, 3)
  async adminUpdateBookingStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: { status?: string; admin_notes?: string },
  ) {
    return this.servicesService.updateBookingStatus(id, body);
  }

  @Delete("admin/services-bookings/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(3)
  async adminDeleteBooking(@Param("id", ParseIntPipe) id: number) {
    return this.servicesService.deleteBooking(id);
  }
}

