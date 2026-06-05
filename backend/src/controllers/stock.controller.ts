import type { Request, Response, NextFunction } from "express";
import { stockService } from "../services/stock.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const stockController = {
  async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const lowStockOnly = request.query.low === "true";
      const result = await stockService.getAll(lowStockOnly, userId);
      sendPaginated(response, result.data, result.total, {
        extra: { lowStockCount: result.lowStockCount },
      });
    } catch (error) {
      next(error);
    }
  },

  async adjustStock(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const stockItem = await stockService.adjustStock(request.params.productId, request.body.delta, userId);
      sendSuccess(response, stockItem, { message: "Stock adjusted" });
    } catch (error) {
      next(error);
    }
  },

  async setStock(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const stockItem = await stockService.setStock(request.params.productId, request.body.quantity, userId);
      sendSuccess(response, stockItem, { message: "Stock updated" });
    } catch (error) {
      next(error);
    }
  },
};
