import type { Request, Response, NextFunction } from "express";
import { saleService } from "../services/sale.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const saleController = {
  async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const productId = request.query.productId as string | undefined;
      const result = await saleService.getAll(productId, userId);
      sendPaginated(response, result.data, result.total, {
        extra: { totalRevenue: result.totalRevenue, count: result.count },
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const stats = await saleService.getStats(userId);
      sendSuccess(response, stats);
    } catch (error) {
      next(error);
    }
  },

  async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const sale = await saleService.getById(request.params.id, userId);
      sendSuccess(response, sale);
    } catch (error) {
      next(error);
    }
  },

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const sale = await saleService.create(request.body, userId);
      sendSuccess(response, sale, { statusCode: 201, message: "Sale created" });
    } catch (error) {
      next(error);
    }
  },

  async remove(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      await saleService.remove(request.params.id, userId);
      sendSuccess(response, null, { message: "Sale deleted" });
    } catch (error) {
      next(error);
    }
  },
};
