import { productModel } from "../models/product.model";
import type { StockItemResponseDto } from "../dtos/stock.dto";

export const stockService = {
  async getAll(lowStockOnly: boolean | undefined, userId: string): Promise<{
    data: StockItemResponseDto[];
    total: number;
    lowStockCount: number;
  }> {
    const products = await productModel.findByUserId(userId);

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

  async adjustStock(productId: string, delta: number, userId: string): Promise<StockItemResponseDto> {
    const product = await productModel.findById(productId);

    if (!product || product.userId !== userId) {
      throwObject("Product not found", 404);
    }

    const updated = await productModel.adjustStock(productId, delta);

    if (!updated) {
      throwObject("Product not found", 404);
    }

    return {
      productId: updated.id,
      productName: updated.name,
      sku: updated.sku,
      category: updated.category,
      quantity: updated.stock,
      lowStockThreshold: updated.lowStockThreshold,
      isLowStock: updated.stock <= updated.lowStockThreshold,
    };
  },

  async setStock(productId: string, quantity: number, userId: string): Promise<StockItemResponseDto> {
    const product = await productModel.findById(productId);

    if (!product || product.userId !== userId) {
      throwObject("Product not found", 404);
    }

    const updated = await productModel.setStock(productId, quantity);

    if (!updated) {
      throwObject("Product not found", 404);
    }

    return {
      productId: updated.id,
      productName: updated.name,
      sku: updated.sku,
      category: updated.category,
      quantity: updated.stock,
      lowStockThreshold: updated.lowStockThreshold,
      isLowStock: updated.stock <= updated.lowStockThreshold,
    };
  },
};

function throwObject(message: string, statusCode: number): never {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
