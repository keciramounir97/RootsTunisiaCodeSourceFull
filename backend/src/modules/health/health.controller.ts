import { Controller, Get, Res, HttpStatus, Inject } from '@nestjs/common';
import { Response } from 'express';
import { Knex } from 'knex';

@Controller()
export class HealthController {
    constructor(@Inject('KnexConnection') private readonly knex: Knex) { }

    @Get('health')
    async health(@Res() res: Response) {
        try {
            // Test database connectivity
            await this.knex.raw('SELECT 1');

            return res.status(HttpStatus.OK).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.env.npm_package_version || '1.0.0',
            });
        } catch (error: any) {
            return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                database: 'disconnected',
                error: error?.message || 'Database connection error',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
            });
        }
    }
}
