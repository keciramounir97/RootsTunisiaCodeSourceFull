import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {
    UsersController,
    AdminManagementController,
    AdminRolesController,
    MyProfileController,
} from './users.controller';
import { ActivityModule } from '../activity/activity.module';
import { MailerModule } from '../../common/mailer/mailer.module';

@Module({
    imports: [ActivityModule, MailerModule],
    controllers: [UsersController, AdminManagementController, AdminRolesController, MyProfileController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
