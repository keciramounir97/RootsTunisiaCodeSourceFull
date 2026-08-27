import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActivityModule } from '../activity/activity.module';
import { MailerModule } from '../../common/mailer/mailer.module';

const JWT_SECRET = process.env.JWT_SECRET || '136d782478b4f564799d6bf639daa785289afe05307ada92a90a45870c726038';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        ActivityModule,
        MailerModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET') || JWT_SECRET,
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d' },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
