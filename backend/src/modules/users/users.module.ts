import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController, AdminRolesController } from './users.controller';
import { ActivityModule } from '../activity/activity.module';

@Module({
    imports: [ActivityModule],
    controllers: [UsersController, AdminRolesController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
