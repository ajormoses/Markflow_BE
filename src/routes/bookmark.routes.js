import { Router } from "express";
import { body, param } from "express-validator";
import {
    createBookmark,
    getBookmarks,
    getBookmarkById,
    updateBookmark,
    deleteBookmark,
    getFrequentlyVisitedBookmarks
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
            .isURL()
            .withMessage("URL is required"),

       body("category")
            .optional()
            .isArray({ min: 1 })
            .withMessage("At least one category is required"),

        body("rating")
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5")
    ],
    validateRequest,
    createBookmark
);

router.get("/bookmarks", getBookmarks);

router.get("/bookmarks/frequent", getFrequentlyVisitedBookmarks);

router.get("/bookmarks/:id",
    [
        param("id")
        .isMongoId()
        .withMessage("Invalid bookmark id")
    ],
    validateRequest,
    getBookmarkById);

router.patch("/bookmarks/:id", 
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid bookmark id"),

        body("title")
            .optional()
            .notEmpty() 
            .withMessage("Title cannot be empty"),

        body("url")
            .optional()
            .isURL()
            .notEmpty()
            .withMessage("URL cannot be empty"),

        body("category")
            .optional()
            .isArray({ min: 1 })
            .withMessage("At least one category is required"),

        body("rating")
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage("Rating must be between 1 and 5")
    ],
    validateRequest,
    updateBookmark
);

router.delete("/bookmarks/:id",
    [
        param("id")
        .isMongoId()
        .withMessage("Invalid bookmark id")
    ],
    validateRequest,
    deleteBookmark);

export default router;