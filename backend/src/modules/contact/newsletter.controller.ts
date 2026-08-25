import { Controller, Post, Body, Get, UseGuards, BadRequestException, Inject } from '@nestjs/common';
import { MailerService } from '../../common/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller()
export class NewsletterController {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
        @Inject('KnexConnection') private readonly knex,
    ) { }

    @Post('newsletter/subscribe')
    async subscribe(@Body() body: { email?: string }) {
        const email = String(body?.email ?? '').trim().toLowerCase();
        if (!email) {
            throw new BadRequestException('Email is required');
        }

        try {
            const existing = await this.knex('newsletter_subscribers').where('email', email).first();
            if (!existing) {
                await this.knex('newsletter_subscribers').insert({ email, created_at: this.knex.fn.now() });
            }
        } catch (err) {
            console.error('Newsletter DB save error:', err?.message || err);
        }

        try {
            const from = this.configService.get<string>('EMAIL_FROM') || this.configService.get<string>('SMTP_USER');
            if (from && email) {
                await this.mailerService.sendMail({
                    from: from,
                    to: email,
                    subject: 'Roots Tunisia Newsletter',
                    text: `Thanks for joining Roots Tunisia. We will reach out to you soon at ${email}.`,
                    html: `<div style="font-family: Arial, sans-serif; color: #2c1810;"><h2 style="color:#134E4A;">Welcome to Roots Tunisia</h2><p>Thanks for joining our newsletter.</p><p>We will reach out to you soon at <strong>${email}</strong>.</p><p style="margin-top:20px;">- Roots Tunisia</p></div>`,
                });
            }
        } catch (err) {
            console.error('Newsletter email error:', err?.message || err);
        }

        return { message: 'Subscribed' };
    }

    @Get('admin/newsletter/subscribers')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async listSubscribers() {
        return this.knex('newsletter_subscribers').select('*').orderBy('created_at', 'desc');
    }
}
