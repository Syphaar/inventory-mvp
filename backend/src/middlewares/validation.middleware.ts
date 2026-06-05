import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/api-response";

export function validate(
  validationFunction: (data: any) => string[],
) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const errors = validationFunction(request.body);

    if (errors.length > 0) {
      sendError(response, 400, "Validation failed", errors);
      return;
    }

    next();
  };
}
