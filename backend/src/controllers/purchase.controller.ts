import type { Request, Response, NextFunction } from "express";
import { purchaseService } from "../services/purchase.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const purchaseController = {
  async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const productId = request.query.productId as string | undefined;
      const result = await purchaseService.getAll(productId, userId);
      sendPaginated(response, result.data, result.total, {
        extra: { totalCost: result.totalCost, count: result.count },
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const stats = await purchaseService.getStats(userId);
      sendSuccess(response, stats);
    } catch (error) {
      next(error);
    }
  },

  async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const purchase = await purchaseService.getById(request.params.id, userId);
      sendSuccess(response, purchase);
    } catch (error) {
      next(error);
    }
  },

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const purchase = await purchaseService.create(request.body, userId);
      sendSuccess(response, purchase, { statusCode: 201, message: "Purchase created" });
    } catch (error) {
      next(error);
    }
  },

  async remove(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      await purchaseService.remove(request.params.id, userId);
      sendSuccess(response, null, { message: "Purchase deleted" });
    } catch (error) {
      next(error);
    }
  },
};
