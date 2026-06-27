import { Router } from "express";
import { updateSettings } from "../controllers/settings.controller.js";
import { requireAuth, validateRequest } from "../middleware/index.js";
import settingsValidation from "../constants/validation/settings.validate.js";


const router = Router()

router.use(requireAuth);

router.patch('/settings', settingsValidation, validateRequest, updateSettings)


export default router