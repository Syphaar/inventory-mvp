import { Router } from "express";
import { purchaseController } from "../controllers/purchase.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { validateCreatePurchaseInput } from "../validators/purchase.validator";

const router = Router();

router.use(authenticate);

router.get("/stats", purchaseController.getStats);
router.get("/", purchaseController.getAll);
router.get("/:id", purchaseController.getById);
router.post("/", validate(validateCreatePurchaseInput), purchaseController.create);
router.delete("/:id", purchaseController.remove);

export default router;
