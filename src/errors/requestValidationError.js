export class RequestValidationError extends Error {
    constructor(errors) {
        super("Invalid request parameters");

        this.statusCode = 400;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}