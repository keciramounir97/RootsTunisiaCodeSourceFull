import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class RemindersController {
    constructor(private readonly service: RemindersService) {}

    @Get('my/reminders')
    @UseGuards(JwtAuthGuard)
    async listMy(@Request() req) {
        return this.service.listByUser(req.user.id);
    }

    @Post('my/reminders')
    @UseGuards(JwtAuthGuard)
    async createMy(@Body() body: any, @Request() req) {
        return this.service.create({ ...body, user_id: req.user.id });
    }

    @Patch('my/reminders/:id')
    @UseGuards(JwtAuthGuard)
    async updateMy(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Request() req) {
        return this.service.update(id, body, req.user.id);
    }

    @Delete('my/reminders/:id')
    @UseGuards(JwtAuthGuard)
    async deleteMy(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.service.delete(id, req.user.id);
    }
}