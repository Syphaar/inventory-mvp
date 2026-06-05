export function validateAdjustStockInput(data: {
  delta: unknown;
  reason?: unknown;
}): string[] {
  const errors: string[] = [];

  if (data.delta === undefined || typeof data.delta !== "number") {
    errors.push("Delta is required and must be a number");
  }

  if (data.reason !== undefined && typeof data.reason !== "string") {
    errors.push("Reason must be a string if provided");
  }

  return errors;
}

export function validateSetStockInput(data: {
  quantity: unknown;
  reason?: unknown;
}): string[] {
  const errors: string[] = [];

  if (data.quantity === undefined || typeof data.quantity !== "number" || data.quantity < 0) {
    errors.push("Quantity is required and must be a non-negative number");
  }

  if (data.reason !== undefined && typeof data.reason !== "string") {
    errors.push("Reason must be a string if provided");
  }

  return errors;
}
