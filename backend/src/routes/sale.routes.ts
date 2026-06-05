import { Router } from "express";
import { saleController } from "../controllers/sale.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validation.middleware";
import { validateCreateSaleInput } from "../validators/sale.validator";

const router = Router();

router.use(authenticate);

router.get("/stats", saleController.getStats);
router.get("/", saleController.getAll);
router.get("/:id", saleController.getById);
router.post("/", validate(validateCreateSaleInput), saleController.create);
router.delete("/:id", saleController.remove);

export default router;
