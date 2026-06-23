import { Router } from "express";
import { registerUser, loginUser, logout, currentUser } from "../controllers/user.controller.js";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validationRequest.js";


const router = Router();

router.post("/login",
    [
        body('email')
        .not().isEmpty()
        .isEmail()
        .withMessage('a valid email is required'), 
    
        body('password')
        .not().isEmpty()
        .isLength({ min: 6 })
        .withMessage('a valid password is required')
    ], validateRequest, loginUser);


router.post("/register", registerUser);
router.post("/logout", logout);
router.get('/current-user', currentUser)