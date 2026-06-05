import { Router } from "express";
import { stockController } from "../controllers/stock.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { validateAdjustStockInput, validateSetStockInput } from "../validators/stock.validator";

const router = Router();

router.use(authenticate);

router.get("/", stockController.getAll);
router.patch("/:productId/adjust", validate(validateAdjustStockInput), stockController.adjustStock);
router.patch("/:productId/set", validate(validateSetStockInput), stockController.setStock);

export default router;
