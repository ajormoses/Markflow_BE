import { Router } from "express";
import { body } from "express-validator";
import {
    createBookmark,
    getBookmarks,
    getBookmarkById,
    updateBookmark,
    deleteBookmark
} from "../controllers/bookmark.controller.js";
import { validateRequest, requireAuth } from "../middleware/index.js";

const router = Router();

router.use(requireAuth);

router.post(
    "/bookmarks",
    [
        body("title")
            .notEmpty()
            .withMessage("Title is required"),

        body("url")
            .notEmpty()
            .withMessage("URL is required")
    ],
    validateRequest,
    createBookmark
);

router.get("/bookmarks", getBookmarks);

router.get("/bookmarks/:id", getBookmarkById);

router.patch("/bookmarks/:id", 
    [
        body("title")
        .optional()
        .notEmpty()
        .withMessage("Title cannot be empty"),

        body("url")
        .optional()
        .notEmpty()
        .withMessage("URL cannot be empty")
    ],
    validateRequest,
    updateBookmark
);

router.delete("/bookmarks/:id", deleteBookmark);

export default router;