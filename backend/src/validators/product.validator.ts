export function validateCreateProductInput(data: {
  sku: unknown;
  name: unknown;
  category: unknown;
  price: unknown;
  cost: unknown;
  stock: unknown;
  lowStockThreshold: unknown;
}): string[] {
  const errors: string[] = [];

  if (!data.sku || typeof data.sku !== "string") {
    errors.push("SKU is required and must be a string");
  }

  if (!data.name || typeof data.name !== "string") {
    errors.push("Name is required and must be a string");
  }

  if (!data.category || typeof data.category !== "string") {
    errors.push("Category is required and must be a string");
  }

  if (data.price === undefined || typeof data.price !== "number" || data.price < 0) {
    errors.push("Price is required and must be a non-negative number");
  }

  if (data.cost === undefined || typeof data.cost !== "number" || data.cost < 0) {
    errors.push("Cost is required and must be a non-negative number");
  }

  if (data.stock === undefined || typeof data.stock !== "number" || data.stock < 0) {
    errors.push("Stock is required and must be a non-negative number");
  }

  if (
    data.lowStockThreshold === undefined ||
    typeof data.lowStockThreshold !== "number" ||
    data.lowStockThreshold < 0
  ) {
    errors.push("Low stock threshold is required and must be a non-negative number");
  }

  return errors;
}

export function validateUpdateProductInput(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  if (data.sku !== undefined && typeof data.sku !== "string") {
    errors.push("SKU must be a string");
  }

  if (data.name !== undefined && typeof data.name !== "string") {
    errors.push("Name must be a string");
  }

  if (data.category !== undefined && typeof data.category !== "string") {
    errors.push("Category must be a string");
  }

  if (data.price !== undefined && (typeof data.price !== "number" || data.price < 0)) {
    errors.push("Price must be a non-negative number");
  }

  if (data.cost !== undefined && (typeof data.cost !== "number" || data.cost < 0)) {
    errors.push("Cost must be a non-negative number");
  }

  if (data.stock !== undefined && (typeof data.stock !== "number" || data.stock < 0)) {
    errors.push("Stock must be a non-negative number");
  }

  if (
    data.lowStockThreshold !== undefined &&
    (typeof data.lowStockThreshold !== "number" || data.lowStockThreshold < 0)
  ) {
    errors.push("Low stock threshold must be a non-negative number");
  }

  return errors;
}
