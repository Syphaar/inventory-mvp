import { productModel } from "../models/product.model";
import type { StockItemResponseDto } from "../dtos/stock.dto";

export const stockService = {
  getAll(lowStockOnly?: boolean): {
    data: StockItemResponseDto[];
    total: number;
    lowStockCount: number;
  } {
    const products = productModel.findAll();

    const stockItems: StockItemResponseDto[] = products.map((product) => ({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      isLowStock: product.stock <= product.lowStockThreshold,
    }));

    const lowStockCount = stockItems.filter((item) => item.isLowStock).length;

    let filteredItems = stockItems;
    if (lowStockOnly) {
      filteredItems = stockItems.filter((item) => item.isLowStock);
    }

    return {
      data: filteredItems,
      total: filteredItems.length,
      lowStockCount,
    };
  },

  adjustStock(productId: string, delta: number): StockItemResponseDto {
    const product = productModel.adjustStock(productId, delta);

    if (!product) {
      throwObject("Product not found", 404);
    }

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      isLowStock: product.stock <= product.lowStockThreshold,
    };
  },

  setStock(productId: string, quantity: number): StockItemResponseDto {
    const product = productModel.setStock(productId, quantity);

    if (!product) {
      throwObject("Product not found", 404);
    }

    return {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      isLowStock: product.stock <= product.lowStockThreshold,
    };
  },
};

function throwObject(message: string, statusCode: number): never {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
