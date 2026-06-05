import type { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import { sendSuccess, sendPaginated } from "../utils/api-response";

export const productController = {
  getAll(_request: Request, response: Response, next: NextFunction): void {
    try {
      const result = productService.getAll();
      sendPaginated(response, result.data, result.total);
    } catch (error) {
      next(error);
    }
  },

  getById(request: Request, response: Response, next: NextFunction): void {
    try {
      const product = productService.getById(request.params.id);
      sendSuccess(response, product);
    } catch (error) {
      next(error);
    }
  },

  create(request: Request, response: Response, next: NextFunction): void {
    try {
      const product = productService.create({
        ...request.body,
        userId: (request as any).user.userId,
      });
      sendSuccess(response, product, { statusCode: 201, message: "Product created" });
    } catch (error) {
      next(error);
    }
  },

  update(request: Request, response: Response, next: NextFunction): void {
    try {
      const product = productService.update(request.params.id, request.body);
      sendSuccess(response, product, { message: "Product updated" });
    } catch (error) {
      next(error);
    }
  },

  remove(request: Request, response: Response, next: NextFunction): void {
    try {
      productService.remove(request.params.id);
      sendSuccess(response, null, { message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  },
};
