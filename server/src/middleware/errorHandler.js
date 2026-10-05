import { z } from 'zod';

// Centralized Express error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error('❌ Centralized API Error Intercepted:', err);

    // 1. Handle Zod Request Validation Failures
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: err.errors[0]?.message || 'Invalid request body data payload.'
        });
    }

    // 2. Handle MongoDB Duplicate Key Rejections (Mongoose error code 11000)
    if (err.code === 11000) {
        return res.status(409).json({
            error: 'Conflict: This entry or identifier resource already exists.'
        });
    }

    // 3. Handle Mongoose ID Schema Casting Errors
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: `Malformed database identifier format on path: ${err.path}`
        });
    }

    // 4. Default Fallback for Unhandled 500 Internal Exceptions
    const statusCode = err.status || 500;
    const message = err.message || 'An unexpected internal server error occurred.';

    return res.status(statusCode).json({
        error: message
    });
};
