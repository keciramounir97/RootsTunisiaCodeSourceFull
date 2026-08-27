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

    @Post('admin/newsletter/send-campaign')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async sendCampaign(@Body() body: { subject: string; content: string }) {
        const { subject, content } = body;
        if (!subject || !content) {
            throw new BadRequestException('Subject and content are required');
        }

        const subscribers = await this.knex('newsletter_subscribers').select('email');
        if (!subscribers || subscribers.length === 0) {
            return { message: 'No subscribers found', count: 0 };
        }

        let sentCount = 0;
        let failCount = 0;

        for (const sub of subscribers) {
            try {
                await this.mailerService.sendMail({
                    to: sub.email,
                    subject: subject,
                    text: content,
                    html: `
                        <div style="font-family: Arial, sans-serif; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                            <h2 style="color: #134E4A; margin-bottom: 16px;">${subject}</h2>
                            <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #374151;">${content}</div>
                            <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
                            <p style="font-size: 12px; color: #9ca3af; text-align: center;">Roots Tunisia · Heritage & Archives</p>
                        </div>
                    `,
                });
                sentCount++;
            } catch (err: any) {
                console.error(`Failed to send campaign email to ${sub.email}:`, err?.message || err);
                failCount++;
            }
        }

        return { message: `Campaign sent to ${sentCount} subscribers (${failCount} failed)`, sentCount, failCount };
    }

    @Post('admin/newsletter/send-individual')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'super_admin')
    async sendIndividual(@Body() body: { email: string; subject: string; content: string }) {
        const { email, subject, content } = body;
        if (!email || !subject || !content) {
            throw new BadRequestException('Email, subject, and content are required');
        }

        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            text: content,
            html: `
                <div style="font-family: Arial, sans-serif; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #134E4A; margin-bottom: 16px;">${subject}</h2>
                    <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #374151;">${content}</div>
                    <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;" />
                    <p style="font-size: 12px; color: #9ca3af; text-align: center;">Roots Tunisia · Heritage & Archives</p>
                </div>
            `,
        });

        return { message: `Email sent to ${email}` };
    }
}
