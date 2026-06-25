import { body, param } from "express-validator";


const createBookmarKValidation = [
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
]

const updateBookmarkValidation = [
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
]


const validateId = [
    param("id")
    .isMongoId()
    .withMessage("Invalid bookmark id")
]



export {
    createBookmarKValidation,
    updateBookmarkValidation,
    validateId
}