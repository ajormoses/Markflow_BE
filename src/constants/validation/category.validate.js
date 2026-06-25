import { body, param } from "express-validator";


const createCategoryValidate =  [
    body("name")
    .notEmpty()
    .withMessage("Name is required"),
]

const updateCategoryValidate =   [
    param("id")
    .isMongoId()
    .withMessage("Invalid category id"),

    body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty")
]


const validateId =  [
    param("id")
    .isMongoId()
    .withMessage("Invalid category id")
]


export {
    createCategoryValidate,
    updateCategoryValidate,
    validateId
}