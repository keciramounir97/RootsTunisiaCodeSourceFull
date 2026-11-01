/**
 * Utility to sanitize textual inputs and prevent XSS, script injection, and protocol abuse.
 */
export function sanitizeInput(input: any): any {
    if (typeof input === 'string') {
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:[^"']*/gi, '')
            .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
            .trim();
    }
    if (Array.isArray(input)) {
        return input.map(sanitizeInput);
    }
    if (input !== null && typeof input === 'object' && !(input instanceof Buffer) && !(input instanceof Date)) {
        const sanitized: Record<string, any> = {};
        for (const [key, value] of Object.entries(input)) {
            // Preserve raw password and binary fields
            if (key.toLowerCase().includes('password') || key.endsWith('_data') || key === 'buffer') {
                sanitized[key] = value;
            } else {
                sanitized[key] = sanitizeInput(value);
            }
        }
        return sanitized;
    }
    return input;
}
