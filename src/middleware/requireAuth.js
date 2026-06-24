import { NotAuthorizedError } from "../errors/notAuthorizedError.js";

export const requireAuth = (req, res, next) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError("Not Authorized");
    }

    next();
};