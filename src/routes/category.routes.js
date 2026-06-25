import { Router } from "express";
import { createCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { validateRequest, requireAuth } from "../middleware/index.js";
import { createCategoryValidate, updateCategoryValidate, validateId } from "../constants/validation/category.validate.js";


const router = Router()

router.use(requireAuth)

router.post(
    "/categories",
    createCategoryValidate,
    validateRequest,
    createCategory
);

router.get("/categories", getCategory);


router.get("/categories/:id",
    validateId,
    validateRequest,
    getCategoryById);

router.patch("/categories/:id", 
    updateCategoryValidate,
    validateRequest,
    updateCategory
);

router.delete("/categories/:id",
    validateId,
    validateRequest,
    deleteCategory);

export default router;