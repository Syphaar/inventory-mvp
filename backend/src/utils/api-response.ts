import { Response } from "express";

interface ApiResponseOptions {
  statusCode?: number;
  message?: string;
}

export function sendSuccess(
  response: Response,
  data: unknown,
  options?: ApiResponseOptions,
): void {
  const statusCode = options?.statusCode ?? 200;
  const message = options?.message ?? "Success";

  response.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendError(
  response: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): void {
  response.status(statusCode).json({
    success: false,
    message,
    errors: errors ?? null,
  });
}

export function sendPaginated(
  response: Response,
  data: unknown[],
  total: number,
  options?: ApiResponseOptions & { extra?: Record<string, unknown> },
): void {
  const statusCode = options?.statusCode ?? 200;
  const message = options?.message ?? "Success";

  response.status(statusCode).json({
    success: true,
    message,
    data,
    total,
    ...(options?.extra ?? {}),
  });
}
