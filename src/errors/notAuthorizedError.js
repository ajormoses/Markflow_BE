export class NotAuthorizedError extends Error {
    constructor(message = "Not authorized") {
        super(message);

        this.statusCode = 401;

        Error.captureStackTrace(this, this.constructor);
    }
}