/**
 * Sale Types
 *
 * TypeScript interfaces matching backend Sale model (/backend/models/sale.model.ts)
 *
 * Backend Model:
 * - Sale { id, productId, quantity, unitPrice, total, customer, date, createdAt, updatedAt }
 *
 * These types ensure frontend-backend type safety.
 * API responses must conform to these interfaces.
 */

/**
 * Sale - Represents a completed sale transaction
 *
 * Records when inventory is sold to a customer
 * Automatically deducts from Product.stock
 *
 * Fields:
 * - id: Unique sale identifier (UUID)
 * - productId: Reference to Product being sold
 * - quantity: Number of units sold
 * - unitPrice: Selling price per unit (in cents or major unit)
 * - total: quantity * unitPrice (computed on backend)
 * - customer: Customer name or identifier
 * - date: When the sale occurred (ISO 8601 datetime)
 *
 * Backend Route: GET /api/sales
 * Response: Sale[]
 *
 * Backend Controller: src/controllers/sale.controller.ts
 */
export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  date: string; // ISO 8601 datetime
}

/**
 * SaleWithProduct - Sale enriched with product information
 *
 * Convenience type for display that includes product details
 */
export interface SaleWithProduct extends Sale {
  productName: string;
  sku: string;
}

/**
 * CreateSaleRequest - Request body for creating a sale
 *
 * Backend Route: POST /api/sales
 * Request body type
 *
 * Note: total is calculated on backend (quantity * unitPrice)
 */
export interface CreateSaleRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  customer: string;
}

/**
 * SalesResponse - API response for fetching sales list
 *
 * Backend Route: GET /api/sales
 * Response body type
 *
 * Optional filters:
 * - GET /api/sales?startDate=2026-01-01&endDate=2026-12-31
 * - GET /api/sales?productId=UUID
 * - GET /api/sales?customer=name
 */
export interface SalesResponse {
  data: Sale[];
  total: number;
  totalRevenue: number;
  count: number;
}

/**
 * SalesStats - Sales analytics/statistics
 *
 * Used on Dashboard for displaying sales metrics
 *
 * Backend Route: GET /api/sales/stats
 * Response body type
 */
export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageTransactionValue: number;
  transactionCount: number;
  lastSaleDate?: string;
}
