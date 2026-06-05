import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/api-response";

export const authController = {
  async login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = request.body;
      const result = await authService.login(email, password);
      sendSuccess(response, result, { message: "Login successful" });
    } catch (error) {
      next(error);
    }
  },

  async register(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = request.body;
      const result = await authService.register(name, email, password);
      sendSuccess(response, result, { statusCode: 201, message: "Registration successful" });
    } catch (error) {
      next(error);
    }
  },

  getProfile(request: Request, response: Response, next: NextFunction): void {
    try {
      const userPayload = (request as any).user;
      const profile = authService.getProfile(userPayload.userId);
      sendSuccess(response, profile);
    } catch (error) {
      next(error);
    }
  },

  logout(_request: Request, response: Response): void {
    sendSuccess(response, null, { message: "Logged out successfully" });
  },
};
