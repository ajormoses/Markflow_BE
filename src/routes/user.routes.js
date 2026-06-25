import { Router } from "express";
import { registerUser, loginUser, logout, currentUser } from "../controllers/user.controller.js";
import { validateRequest } from "../middleware/validationRequest.js";
import loginValidate from "../constants/validation/user.validate.js";


const router = Router();

router.post("/login", loginValidate, validateRequest, loginUser);
router.post("/register", registerUser);
router.post("/logout", logout);
router.get('/current-user', currentUser)


export default router