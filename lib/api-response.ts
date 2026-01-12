/**
 * API Response Helper
 * Chuẩn hóa format response cho tất cả API routes
 */

import { NextResponse } from 'next/server';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ApiSuccessResponse<T = unknown> {
    success: true;
    message?: string;
    data: T;
    meta?: ResponseMeta;
}

export interface ApiErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
        details?: unknown;
    };
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}

export interface ResponseMeta {
    pagination?: PaginationMeta;
    timestamp?: string;
    requestId?: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// ERROR CODES
// ============================================

export const ErrorCodes = {
    // Client errors (4xx)
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',
    CONFLICT: 'CONFLICT',

    // Server errors (5xx)
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    DATABASE_ERROR: 'DATABASE_ERROR',
    EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// ============================================
// SUCCESS RESPONSE HELPERS
// ============================================

/**
 * Tạo success response
 */
export function successResponse<T>(
    data: T,
    options?: {
        message?: string;
        status?: number;
        headers?: Record<string, string>;
        pagination?: PaginationMeta;
    }
): NextResponse<ApiSuccessResponse<T>> {
    const response: ApiSuccessResponse<T> = {
        success: true,
        data,
    };

    if (options?.message) {
        response.message = options.message;
    }

    if (options?.pagination) {
        response.meta = {
            ...response.meta,
            pagination: options.pagination,
            timestamp: new Date().toISOString(),
        };
    }

    return NextResponse.json(response, {
        status: options?.status || 200,
        headers: options?.headers,
    });
}

/**
 * Tạo paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    pagination: {
        page: number;
        limit: number;
        total: number;
    },
    options?: {
        message?: string;
        headers?: Record<string, string>;
    }
): NextResponse<ApiSuccessResponse<T[]>> {
    const totalPages = Math.ceil(pagination.total / pagination.limit);

    return successResponse(data, {
        message: options?.message,
        headers: options?.headers,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            totalPages,
            hasMore: pagination.page < totalPages,
        },
    });
}

/**
 * Created response (201)
 */
export function createdResponse<T>(
    data: T,
    message?: string
): NextResponse<ApiSuccessResponse<T>> {
    return successResponse(data, { status: 201, message });
}

/**
 * No content response (204)
 */
export function noContentResponse(): NextResponse {
    return new NextResponse(null, { status: 204 });
}

// ============================================
// ERROR RESPONSE HELPERS
// ============================================

/**
 * Tạo error response
 */
export function errorResponse(
    code: ErrorCode,
    message: string,
    options?: {
        status?: number;
        details?: unknown;
        headers?: Record<string, string>;
    }
): NextResponse<ApiErrorResponse> {
    const response: ApiErrorResponse = {
        success: false,
        error: {
            code,
            message,
        },
    };

    if (options?.details) {
        response.error.details = options.details;
    }

    // Map error codes to HTTP status codes
    const statusMap: Record<ErrorCode, number> = {
        [ErrorCodes.BAD_REQUEST]: 400,
        [ErrorCodes.VALIDATION_ERROR]: 400,
        [ErrorCodes.UNAUTHORIZED]: 401,
        [ErrorCodes.FORBIDDEN]: 403,
        [ErrorCodes.NOT_FOUND]: 404,
        [ErrorCodes.CONFLICT]: 409,
        [ErrorCodes.RATE_LIMITED]: 429,
        [ErrorCodes.INTERNAL_ERROR]: 500,
        [ErrorCodes.DATABASE_ERROR]: 500,
        [ErrorCodes.SERVICE_UNAVAILABLE]: 503,
        [ErrorCodes.EXTERNAL_API_ERROR]: 502,
    };

    return NextResponse.json(response, {
        status: options?.status || statusMap[code] || 500,
        headers: options?.headers,
    });
}

// Convenience error functions
export function badRequestError(message: string, details?: unknown) {
    return errorResponse(ErrorCodes.BAD_REQUEST, message, { details });
}

export function validationError(message: string, details?: unknown) {
    return errorResponse(ErrorCodes.VALIDATION_ERROR, message, { details });
}

export function unauthorizedError(message = 'Bạn cần đăng nhập để thực hiện hành động này') {
    return errorResponse(ErrorCodes.UNAUTHORIZED, message);
}

export function forbiddenError(message = 'Bạn không có quyền thực hiện hành động này') {
    return errorResponse(ErrorCodes.FORBIDDEN, message);
}

export function notFoundError(message = 'Không tìm thấy tài nguyên') {
    return errorResponse(ErrorCodes.NOT_FOUND, message);
}

export function conflictError(message: string, details?: unknown) {
    return errorResponse(ErrorCodes.CONFLICT, message, { details });
}

export function rateLimitedError(retryAfter: number) {
    return errorResponse(
        ErrorCodes.RATE_LIMITED,
        `Quá nhiều yêu cầu. Vui lòng thử lại sau ${retryAfter} giây.`,
        {
            headers: { 'Retry-After': retryAfter.toString() },
            details: { retryAfter },
        }
    );
}

export function internalError(message = 'Đã xảy ra lỗi. Vui lòng thử lại sau.') {
    return errorResponse(ErrorCodes.INTERNAL_ERROR, message);
}

export function databaseError(message = 'Lỗi cơ sở dữ liệu. Vui lòng thử lại sau.') {
    return errorResponse(ErrorCodes.DATABASE_ERROR, message);
}

export function externalApiError(message: string, details?: unknown) {
    return errorResponse(ErrorCodes.EXTERNAL_API_ERROR, message, { details });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Handle common Zod validation errors
 */
export function handleZodError(error: { issues: Array<{ path: (string | number)[]; message: string }> }) {
    const details = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
    }));

    return validationError(error.issues[0]?.message || 'Dữ liệu không hợp lệ', details);
}

/**
 * Safe error handler for API routes
 */
export function handleApiError(error: unknown) {
    console.error('API Error:', error);

    if (error instanceof Error) {
        // Check for Prisma errors
        if (error.message.includes('Prisma') || error.message.includes('prisma')) {
            return databaseError();
        }

        // Don't expose internal error messages in production
        if (process.env.NODE_ENV === 'development') {
            return internalError(error.message);
        }
    }

    return internalError();
}

// ============================================
// API RESPONSE TYPE GUARD
// ============================================

export function isApiError(response: ApiResponse): response is ApiErrorResponse {
    return response.success === false;
}

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
    return response.success === true;
}
