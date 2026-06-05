export function validateCreatePurchaseInput(data: {
  productId: unknown;
  quantity: unknown;
  unitCost: unknown;
  supplier: unknown;
}): string[] {
  const errors: string[] = [];

  if (!data.productId || typeof data.productId !== "string") {
    errors.push("Product ID is required and must be a string");
  }

  if (data.quantity === undefined || typeof data.quantity !== "number" || data.quantity <= 0) {
    errors.push("Quantity is required and must be a positive number");
  }

  if (data.unitCost === undefined || typeof data.unitCost !== "number" || data.unitCost < 0) {
    errors.push("Unit cost is required and must be a non-negative number");
  }

  if (!data.supplier || typeof data.supplier !== "string") {
    errors.push("Supplier is required and must be a string");
  }

  return errors;
}
