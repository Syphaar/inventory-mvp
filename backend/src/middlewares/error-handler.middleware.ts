import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/api-response";

export function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction,
): void {
  console.error("Unhandled error:", error);

  const statusCode = (error as any).statusCode || 500;
  const message = statusCode === 500 ? "Internal server error" : error.message;

  sendError(response, statusCode, message);
}
