import { type ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

export interface ApiError {
    statusCode: number;
    message: string;
}

export class BadRequestError implements ApiError {
    statusCode = 400;
    message = 'Bad Request';
    validationResult: ValidationResult;
    constructor(validationResult: ValidationResult) {
        this.validationResult = validationResult;
    }
}

export class ConflictError implements ApiError {
    statusCode = 409;
    message = 'Conflict';
    conflictReason: string;
    constructor(conflictReason: string) {
        this.conflictReason = conflictReason;
    }
}

export class NotAuthenticatedError implements ApiError {
    statusCode = 401;
    message = 'Not Authenticated';
    constructor(message?: string) {
        if (message) {
            this.message = message;
        }
    }
}

export class NotAuthorizedError implements ApiError {
    statusCode = 403;
    message = 'Not Authorized';
}

export class NotFoundError implements ApiError {
    statusCode = 404;
    message = 'Not Found';
    resource: string;
    constructor(resource?: string) {
        this.resource = resource;
    }
}

export class SystemError implements ApiError {
    statusCode = 500;
    message = 'System Error';
    error: Error;
    constructor(error: Error) {
        this.error = error;
    }
}
