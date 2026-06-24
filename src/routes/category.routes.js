import { Router } from "express";
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { validateRequest, requireAuth } from "../middleware/index.js";
import { body, param } from "express-validator";


const router = Router()

router.use(requireAuth)

router.post(
    "/categories",
    [
        body("name")
            .notEmpty()
            .withMessage("Name is required"),
    ],
    validateRequest,
    createCategory
);

router.get("/categories", getCategory);


router.get("/categories/:id",
    [
        param("id")
        .isMongoId()
        .withMessage("Invalid category id")
    ],
    validateRequest,
    getCategoryById);

router.patch("/categories/:id", 
    [
        param("id")
            .isMongoId()
            .withMessage("Invalid category id"),

            body("name")
            .optional()
            .notEmpty()
            .withMessage("Name cannot be empty")
    ],
    validateRequest,
    updateCategory
);

router.delete("/categories/:id",
    [
        param("id")
        .isMongoId()
        .withMessage("Invalid category id")
    ],
    validateRequest,
    deleteCategory);

export default router;