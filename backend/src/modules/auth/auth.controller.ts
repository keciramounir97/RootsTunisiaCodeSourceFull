
import { Controller, Post, Body, UseGuards, Request, Get, HttpCode, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { VerifyResetDto } from './dto/verify-reset.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user); // Returns { token, refreshToken, user } usually
    }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('refresh')
    @HttpCode(200)
    async refresh(@Body() body: { refreshToken?: string }) {
        return this.authService.refreshToken(body?.refreshToken);
    }

    @Post('reset/verify')
    @HttpCode(200)
    async verifyReset(@Body() dto: VerifyResetDto) {
        return this.authService.verifyReset(dto.email, dto.code, dto.newPassword);
    }

    @Post('reset')
    @HttpCode(200)
    async requestReset(@Body() dto: RequestResetDto) {
        return this.authService.requestReset(dto.email);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    async logout(@Request() req) {
        return this.authService.logout(req.user.id);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Request() req) {
        return req.user;
    }
}
