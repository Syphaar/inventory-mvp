import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { validateLoginInput, validateRegisterInput } from "../validators/auth.validator";

const router = Router();

// Authentication routes
router.post("/login", validate(validateLoginInput), authController.login);

// Registration route with validation middleware
router.post("/register", validate(validateRegisterInput), authController.register);

// Protected route to get user profile
router.get("/me", authenticate, authController.getProfile);

// Logout route (optional, can also be handled client-side by deleting token)
router.post("/logout", authenticate, authController.logout);

export default router;
