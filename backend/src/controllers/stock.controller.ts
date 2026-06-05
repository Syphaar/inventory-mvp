import type { Request, Response, NextFunction } from "express";
import { stockService } from "../services/stock.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const stockController = {
  getAll(request: Request, response: Response, next: NextFunction): void {
    try {
      const lowStockOnly = request.query.low === "true";
      const result = stockService.getAll(lowStockOnly);
      sendPaginated(response, result.data, result.total, {
        extra: { lowStockCount: result.lowStockCount },
      });
    } catch (error) {
      next(error);
    }
  },

  adjustStock(request: Request, response: Response, next: NextFunction): void {
    try {
      const stockItem = stockService.adjustStock(request.params.productId, request.body.delta);
      sendSuccess(response, stockItem, { message: "Stock adjusted" });
    } catch (error) {
      next(error);
    }
  },

  setStock(request: Request, response: Response, next: NextFunction): void {
    try {
      const stockItem = stockService.setStock(request.params.productId, request.body.quantity);
      sendSuccess(response, stockItem, { message: "Stock updated" });
    } catch (error) {
      next(error);
    }
  },
};
