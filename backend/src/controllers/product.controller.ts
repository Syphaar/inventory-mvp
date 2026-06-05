import type { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const productController = {
  async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const result = await productService.getAll(userId);
      sendPaginated(response, result.data, result.total);
    } catch (error) {
      next(error);
    }
  },

  async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const product = await productService.getById(request.params.id, userId);
      sendSuccess(response, product);
    } catch (error) {
      next(error);
    }
  },

  async create(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create({
        ...request.body,
        userId: (request as any).user.userId,
      });
      sendSuccess(response, product, { statusCode: 201, message: "Product created" });
    } catch (error) {
      next(error);
    }
  },

  async update(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      const product = await productService.update(request.params.id, request.body, userId);
      sendSuccess(response, product, { message: "Product updated" });
    } catch (error) {
      next(error);
    }
  },

  async remove(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (request as any).user.userId;
      await productService.remove(request.params.id, userId);
      sendSuccess(response, null, { message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  },
};
