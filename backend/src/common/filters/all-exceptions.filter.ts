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

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
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
