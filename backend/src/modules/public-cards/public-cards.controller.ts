import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { PublicCardsService } from "./public-cards.service";

/** Super-admin management of the "Archives" / "Sources" public cards. */
@Controller("admin/public-cards")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("super_admin")
export class AdminPublicCardsController {
  constructor(private readonly service: PublicCardsService) {}

  @Get()
  list(@Query("kind") kind?: string) {
    return this.service.list(kind, false);
  }

  @Get("locations")
  getLocations() {
    return this.service.getLocations();
  }

  @Post("locations")
  addLocation(@Body() body: any, @Request() req) {
    return this.service.addLocation(body, req.user.id);
  }

  @Put("locations")
  saveLocations(@Body() body: any, @Request() req) {
    return this.service.saveLocations(body?.locations || body, req.user.id);
  }

  @Delete("locations/:key")
  deleteLocation(@Param("key") key: string, @Request() req) {
    return this.service.deleteLocation(key, req.user.id);
  }

  @Post("reset-verified")
  resetVerified(@Request() req) {
    return this.service.seedVerifiedArchives(req.user.id);
  }

  @Post()
  create(@Body() body: any, @Request() req) {
    return this.service.create(body, req.user.id);
  }

  @Put("reorder")
  reorder(@Body() body: { kind: string; ids: number[] }, @Request() req) {
    return this.service.reorder(body?.kind, body?.ids, req.user.id);
  }

  @Put(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() body: any, @Request() req) {
    return this.service.update(id, body, req.user.id);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number, @Request() req) {
    return this.service.remove(id, req.user.id);
  }
}

@Controller("public-cards")
export class PublicCardsController {
  constructor(private readonly service: PublicCardsService) {}

  @Get()
  @Header("Cache-Control", "public, max-age=15")
  list(@Query("kind") kind?: string) {
    return this.service.list(kind, true);
  }

  @Get("locations")
  @Header("Cache-Control", "public, max-age=30")
  getLocations() {
    return this.service.getLocations();
  }
}

