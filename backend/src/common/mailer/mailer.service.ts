import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
    private readonly logger = new Logger(MailerService.name);
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        const host = this.configService.get<string>('SMTP_HOST') || 'smtp.hostinger.com';
        const port = Number(this.configService.get<number>('SMTP_PORT')) || 465;
        const secureConfig = this.configService.get<string>('SMTP_SECURE');
        const secure = secureConfig !== undefined ? secureConfig === 'true' : port === 465;
        const user = this.configService.get<string>('SMTP_USER') || 'devteam@rootstunisia.com';
        const pass = this.configService.get<string>('SMTP_PASS') || 'AdminRootsTunis2025$';

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    async sendMail(options: nodemailer.SendMailOptions) {
        const defaultFrom = this.configService.get<string>('SMTP_FROM') || 'Roots Tunisia <devteam@rootstunisia.com>';
        const mailOptions = {
            from: defaultFrom,
            ...options,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent successfully to ${mailOptions.to} (MessageId: ${info.messageId})`);
            return info;
        } catch (err: any) {
            this.logger.error(`Failed to send email to ${mailOptions.to}: ${err?.message || err}`);
            throw err;
        }
    }
}

