import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import saleRoutes from "./sale.routes";
import purchaseRoutes from "./purchase.routes";
import stockRoutes from "./stock.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/sales", saleRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/stocks", stockRoutes);

export default router;
