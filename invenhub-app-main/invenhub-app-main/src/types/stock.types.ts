/**
 * Stock Types
 *
 * TypeScript interfaces for inventory stock management
 * Stock is derived from Product model but represents inventory/warehouse tracking
 *
 * Backend Model:
 * - Stock { id, productId, quantity, warehouse, lastUpdated }
 * or embedded in Product.stock field
 *
 * These types ensure frontend-backend type safety for stock operations.
 */

import type { Product } from "./product.types";

/**
 * StockItem - Represents current stock level for a product
 *
 * Used for stock tracking and low stock alerts
 *
 * Fields:
 * - productId: Reference to Product
 * - productName: Product display name
 * - sku: Product SKU for reference
 * - quantity: Current stock quantity
 * - lowStockThreshold: Alert threshold
 * - isLowStock: Computed flag if quantity <= threshold
 *
 * Backend Route: GET /api/stocks or derived from GET /api/products
 * Response: StockItem[]
 */
export interface StockItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

/**
 * AdjustStockRequest - Request to adjust inventory quantity
 *
 * Backend Route: PATCH /api/stocks/:productId/adjust
 * Request body type
 *
 * delta: positive for increase (purchase), negative for decrease (sale/adjustment)
 */
export interface AdjustStockRequest {
  delta: number;
  reason?: string; // 'purchase', 'sale', 'adjustment', 'inventory_count'
}

/**
 * SetStockRequest - Request to set absolute stock quantity
 *
 * Backend Route: PATCH /api/stocks/:productId/set
 * Request body type
 *
 * Used for inventory counts/corrections
 */
export interface SetStockRequest {
  quantity: number;
  reason?: string; // 'inventory_count', 'correction'
}

/**
 * StockResponse - API response for stock operations
 *
 * Backend Route: GET /api/stocks
 * Response body type
 */
export interface StockResponse {
  data: StockItem[];
  total: number;
  lowStockCount: number;
}
