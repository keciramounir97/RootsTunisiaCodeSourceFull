import { Injectable, Logger, Inject } from '@nestjs/common';
import { MailerService } from '../mailer/mailer.service';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface SystemAlert {
    type: string;
    message: string;
    severity: AlertSeverity;
    metadata?: Record<string, any>;
    timestamp: Date;
}

@Injectable()
export class AlertsService {
    private readonly logger = new Logger('SystemAlerts');
    private readonly failedLoginMap = new Map<string, { count: number; firstAttempt: number }>();

    constructor(
        @Inject('KnexConnection') private readonly knex: any,
        private readonly mailerService: MailerService,
    ) {}

    async triggerAlert(alert: { type: string; message: string; severity?: AlertSeverity; metadata?: Record<string, any> }) {
        const severity = alert.severity || 'warning';
        const logPrefix = severity === 'critical' ? '🚨 [CRITICAL ALERT]' : severity === 'warning' ? '⚠️ [WARNING ALERT]' : 'ℹ️ [INFO ALERT]';
        
        this.logger.warn(`${logPrefix} ${alert.type.toUpperCase()}: ${alert.message}`);

        try {
            if (await this.knex.schema.hasTable('activity_logs')) {
                await this.knex('activity_logs').insert({
                    actor_user_id: null,
                    type: `alert_${alert.type}`,
                    description: `[${severity.toUpperCase()}] ${alert.message} ${alert.metadata ? JSON.stringify(alert.metadata) : ''}`.trim(),
                    created_at: this.knex.fn.now(),
                });
            }
        } catch (e: any) {
            // Fail safely without disrupting application flow
        }

        // For critical alerts, notify devteam if mailer is configured
        if (severity === 'critical') {
            const adminEmail = process.env.SMTP_USER || 'devteam@rootstunisia.com';
            this.mailerService.sendMail({
                to: adminEmail,
                subject: `🚨 Roots Tunisia Critical Alert: ${alert.type}`,
                text: `${alert.message}\n\nMetadata: ${JSON.stringify(alert.metadata || {}, null, 2)}\nTimestamp: ${new Date().toISOString()}`,
            }).catch(() => {});
        }
    }

    recordFailedLogin(ip: string, email: string) {
        const now = Date.now();
        const existing = this.failedLoginMap.get(ip) || { count: 0, firstAttempt: now };
        
        // Reset window after 15 minutes
        if (now - existing.firstAttempt > 15 * 60 * 1000) {
            existing.count = 1;
            existing.firstAttempt = now;
        } else {
            existing.count += 1;
        }
        
        this.failedLoginMap.set(ip, existing);

        if (existing.count >= 5) {
            this.triggerAlert({
                type: 'brute_force_attempt',
                message: `Multiple failed login attempts (${existing.count}) detected from IP ${ip} targeting email ${email}`,
                severity: existing.count >= 10 ? 'critical' : 'warning',
                metadata: { ip, email, count: existing.count },
            });
        }
    }

    clearFailedLogin(ip: string) {
        this.failedLoginMap.delete(ip);
    }
}
