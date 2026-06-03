/**
 * Stock API Service
 *
 * Handles all stock/inventory-related API calls to the backend.
 *
 * Backend Routes:
 * - GET /api/stocks - List all stock levels
 * - PATCH /api/stocks/:productId/adjust - Adjust stock quantity
 * - PATCH /api/stocks/:productId/set - Set absolute stock quantity
 *
 * Backend Controller: src/controllers/stock.controller.ts or embedded in product.controller.ts
 *
 * Note: Stock is typically managed through Product.stock field.
 * These endpoints provide alternative ways to adjust inventory.
 *
 * All functions use the centralized apiClient (src/api/apiClient.ts)
 * which automatically attaches JWT tokens to requests.
 */

import apiClient from "./apiClient";
import type {
  StockItem,
  AdjustStockRequest,
  SetStockRequest,
  StockResponse,
} from "@/types/stock.types";

/**
 * Get All Stock Levels
 *
 * Backend Route: GET /api/stocks
 * Response: { data: StockItem[]; total: number; lowStockCount: number }
 *
 * Retrieves current inventory levels for all products.
 * Includes low stock indicators.
 *
 * Usage:
 * const stocks = await stockApi.getAll();
 *
 * @returns All stock items with levels and thresholds
 * @throws AxiosError if not authenticated or server error
 */
export const getAll = async (): Promise<StockItem[]> => {
  const response = await apiClient.get<StockResponse>("/stocks");
  return response.data.data;
};

/**
 * Adjust Stock Quantity
 *
 * Backend Route: PATCH /api/stocks/:productId/adjust
 * Request: { delta: number; reason?: string }
 * Response: Updated StockItem
 *
 * Adjusts product stock by adding or subtracting quantity.
 *
 * Usage examples:
 * - Increase after purchase: await stockApi.adjustStock('product-uuid', { delta: 50, reason: 'purchase' });
 * - Decrease after damage: await stockApi.adjustStock('product-uuid', { delta: -3, reason: 'damaged' });
 * - Manual correction: await stockApi.adjustStock('product-uuid', { delta: 5, reason: 'inventory_count' });
 *
 * Positive delta increases stock (purchasing, returns)
 * Negative delta decreases stock (sales, damage, loss)
 *
 * Backend Validation:
 * - Resulting stock cannot be negative
 * - Delta should not be zero
 *
 * @param productId - Product ID (UUID)
 * @param data - Adjustment details (delta and optional reason)
 * @returns Updated stock item
 * @throws AxiosError if validation fails (400), product not found (404), or not authenticated
 */
export const adjustStock = async (
  productId: string,
  data: AdjustStockRequest,
): Promise<StockItem> => {
  const response = await apiClient.patch<StockItem>(`/stocks/${productId}/adjust`, data);
  return response.data;
};

/**
 * Set Stock Quantity (Absolute)
 *
 * Backend Route: PATCH /api/stocks/:productId/set
 * Request: { quantity: number; reason?: string }
 * Response: Updated StockItem
 *
 * Sets product stock to an absolute quantity.
 * Used for inventory counts and major corrections.
 *
 * Usage examples:
 * - After physical count: await stockApi.setStock('product-uuid', { quantity: 100 });
 * - Correction: await stockApi.setStock('product-uuid', { quantity: 50, reason: 'inventory_count' });
 *
 * Backend Validation:
 * - Quantity must be non-negative
 * - Should typically be used with reason for audit trail
 *
 * @param productId - Product ID (UUID)
 * @param data - Absolute quantity and optional reason
 * @returns Updated stock item
 * @throws AxiosError if validation fails (400), product not found (404), or not authenticated
 */
export const setStock = async (productId: string, data: SetStockRequest): Promise<StockItem> => {
  const response = await apiClient.patch<StockItem>(`/stocks/${productId}/set`, data);
  return response.data;
};

/**
 * Get Low Stock Products
 *
 * Backend Route: GET /api/stocks?low=true
 * Response: { data: StockItem[]; total: number }
 *
 * Retrieves only products with stock at or below their threshold.
 * Useful for inventory alerts and reordering.
 *
 * Usage:
 * const lowStockItems = await stockApi.getLowStock();
 *
 * @returns Stock items that are below threshold
 * @throws AxiosError if not authenticated or server error
 */
export const getLowStock = async (): Promise<StockItem[]> => {
  const response = await apiClient.get<StockResponse>("/stocks?low=true");
  return response.data.data;
};

export const stockApi = {
  getAll,
  adjustStock,
  setStock,
  getLowStock,
};
