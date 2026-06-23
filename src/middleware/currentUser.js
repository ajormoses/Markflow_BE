import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const currentUserMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(payload.id);

        req.currentUser = user;
    } catch (err) {
        console.log("JWT ERROR:", err.message);
        req.currentUser = null;
    }

    next();
};