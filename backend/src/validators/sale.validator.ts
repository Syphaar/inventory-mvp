export function validateCreateSaleInput(data: {
  productId: unknown;
  quantity: unknown;
  unitPrice: unknown;
  customer: unknown;
}): string[] {
  const errors: string[] = [];

  if (!data.productId || typeof data.productId !== "string") {
    errors.push("Product ID is required and must be a string");
  }

  if (data.quantity === undefined || typeof data.quantity !== "number" || data.quantity <= 0) {
    errors.push("Quantity is required and must be a positive number");
  }

  if (data.unitPrice === undefined || typeof data.unitPrice !== "number" || data.unitPrice < 0) {
    errors.push("Unit price is required and must be a non-negative number");
  }

  if (!data.customer || typeof data.customer !== "string") {
    errors.push("Customer is required and must be a string");
  }

  return errors;
}
