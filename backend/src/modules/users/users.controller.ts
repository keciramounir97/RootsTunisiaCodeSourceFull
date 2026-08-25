
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, ParseIntPipe, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() body: CreateUserDto, @Request() req) {
        return this.usersService.create(body, req.user.id);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @Request() req) {
        return this.usersService.update(id, body, req.user.id);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.usersService.delete(id, req.user.id);
    }
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
export class AdminRolesController {
    constructor(@Inject('KnexConnection') private readonly knex) {}

    @Get('roles')
    async listRoles() {
        return this.knex('roles').select('id', 'name');
    }
}
