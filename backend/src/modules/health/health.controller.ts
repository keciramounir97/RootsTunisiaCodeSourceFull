import { Controller, Get } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';

@Controller()
export class HealthController {
    constructor(@Inject('KnexConnection') private readonly knex: Knex) { }

    @Get('health')
    async health() {
        try {
            // Test database connectivity
            await this.knex.raw('SELECT 1');

            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.env.npm_package_version || '1.0.0'
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error.message,
                uptime: process.uptime(),
                memory: process.memoryUsage()
            };
        }
    }
}
