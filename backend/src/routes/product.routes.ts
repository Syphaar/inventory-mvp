import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  validateCreateProductInput,
  validateUpdateProductInput,
} from "../validators/product.validator";

const router = Router();

router.use(authenticate);

// CRUD routes for products
router.get("/", productController.getAll);

// Get product by ID, create, update, delete routes with validation
router.get("/:id", productController.getById);

// Create and update routes with validation middleware
router.post("/", validate(validateCreateProductInput), productController.create);

// Update route with validation middleware
router.put("/:id", validate(validateUpdateProductInput), productController.update);

// Delete route
router.delete("/:id", productController.remove);

export default router;
