import type { Request, Response, NextFunction } from "express";
import { saleService } from "../services/sale.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const saleController = {
  getAll(request: Request, response: Response, next: NextFunction): void {
    try {
      const productId = request.query.productId as string | undefined;
      const result = saleService.getAll(productId);
      sendPaginated(response, result.data, result.total, {
        extra: { totalRevenue: result.totalRevenue, count: result.count },
      });
    } catch (error) {
      next(error);
    }
  },

  getStats(_request: Request, response: Response, next: NextFunction): void {
    try {
      const stats = saleService.getStats();
      sendSuccess(response, stats);
    } catch (error) {
      next(error);
    }
  },

  getById(request: Request, response: Response, next: NextFunction): void {
    try {
      const sale = saleService.getById(request.params.id);
      sendSuccess(response, sale);
    } catch (error) {
      next(error);
    }
  },

  create(request: Request, response: Response, next: NextFunction): void {
    try {
      const sale = saleService.create(request.body);
      sendSuccess(response, sale, { statusCode: 201, message: "Sale created" });
    } catch (error) {
      next(error);
    }
  },

  remove(request: Request, response: Response, next: NextFunction): void {
    try {
      saleService.remove(request.params.id);
      sendSuccess(response, null, { message: "Sale deleted" });
    } catch (error) {
      next(error);
    }
  },
};
