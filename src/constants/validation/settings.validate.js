import { body } from "express-validator";


const settingsValidation = [
    body("defaultCategory")
        .optional()
        .isMongoId()
        .withMessage("Invalid category id"),

    body("defaultRating")
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage("Default rating must be between 1 and 5"),

    body("darkMode")
        .optional()
        .isBoolean()
        .withMessage("Dark mode must be true or false"),

    body("language")
        .optional()
        .isString()
        .withMessage("Language must be a string")
];

export default settingsValidation
