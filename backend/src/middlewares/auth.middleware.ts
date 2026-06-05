import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { sendError } from "../utils/api-response";

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    sendError(response, 401, "Authentication required. No token provided.");
    return;
  }

  const parts = authorizationHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    sendError(response, 401, "Invalid authorization format. Use: Bearer <token>");
    return;
  }

  const token = parts[1];

  try {
    const payload = verifyToken(token);
    (request as any).user = payload;
    next();
  } catch (error) {
    sendError(response, 401, "Invalid or expired token.");
  }
}
