import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const rawErrorMsg = exception instanceof Error ? exception.message : String(exception || '');
        const isDbFailure = (
            rawErrorMsg.includes('ECONNREFUSED') ||
            rawErrorMsg.includes('ETIMEDOUT') ||
            rawErrorMsg.includes('Timeout acquiring a connection') ||
            rawErrorMsg.includes('pool is probably full') ||
            rawErrorMsg.includes('getaddrinfo') ||
            rawErrorMsg.includes('ER_BAD_DB_ERROR') ||
            rawErrorMsg.includes('ER_ACCESS_DENIED')
        );

        const status = isDbFailure
            ? HttpStatus.SERVICE_UNAVAILABLE
            : exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = isDbFailure
            ? 'Database service is temporarily unavailable. Please try again shortly or contact support.'
            : exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';

        // Extract message string if object
        const errorMessage = typeof message === 'object' && (message as Record<string, unknown>)?.message
            ? (message as Record<string, unknown>).message
            : message;

        const requestId = (request as Request & { id?: string }).id || '-';

        // Production: avoid logging full stack to stdout (use structured logging in production)
        const isProduction = process.env.NODE_ENV === 'production';
        this.logger.error(
            `[${requestId}] HTTP ${status} - ${Array.isArray(errorMessage) ? errorMessage[0] : errorMessage}`,
        );
        if (!isProduction && exception instanceof Error) {
            this.logger.debug(exception.stack);
        }

        if (requestId !== '-') {
            response.setHeader('X-Request-Id', requestId);
        }

        const origin = request.headers.origin;
        const allowedOrigin = origin || '*';
        response.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        response.setHeader('Vary', 'Origin');
        response.setHeader('Access-Control-Allow-Credentials', 'true');
        response.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        response.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, If-Modified-Since, Accept, Origin, X-Request-Id',
        );

        response.status(status).json({
            statusCode: status,
            message: Array.isArray(errorMessage) ? errorMessage[0] : errorMessage,
            data: null,
            error: typeof message === 'object' ? message : { message },
            timestamp: new Date().toISOString(),
            path: request.url,
            ...(requestId !== '-' && { requestId }),
        });
    }
}
