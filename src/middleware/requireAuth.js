import { NotAuthorizedError } from "../errors/notAuthorizedError.js";

export const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError("Please login to continue");
    }

    next();
};