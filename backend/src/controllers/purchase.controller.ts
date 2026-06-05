import type { Request, Response, NextFunction } from "express";
import { purchaseService } from "../services/purchase.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const purchaseController = {
  getAll(request: Request, response: Response, next: NextFunction): void {
    try {
      const productId = request.query.productId as string | undefined;
      const result = purchaseService.getAll(productId);
      sendPaginated(response, result.data, result.total, {
        extra: { totalCost: result.totalCost, count: result.count },
      });
    } catch (error) {
      next(error);
    }
  },

  getStats(_request: Request, response: Response, next: NextFunction): void {
    try {
      const stats = purchaseService.getStats();
      sendSuccess(response, stats);
    } catch (error) {
      next(error);
    }
  },

  getById(request: Request, response: Response, next: NextFunction): void {
    try {
      const purchase = purchaseService.getById(request.params.id);
      sendSuccess(response, purchase);
    } catch (error) {
      next(error);
    }
  },

  create(request: Request, response: Response, next: NextFunction): void {
    try {
      const purchase = purchaseService.create(request.body);
      sendSuccess(response, purchase, { statusCode: 201, message: "Purchase created" });
    } catch (error) {
      next(error);
    }
  },

  remove(request: Request, response: Response, next: NextFunction): void {
    try {
      purchaseService.remove(request.params.id);
      sendSuccess(response, null, { message: "Purchase deleted" });
    } catch (error) {
      next(error);
    }
  },
};
