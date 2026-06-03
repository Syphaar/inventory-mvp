/**
 * Purchase Types
 *
 * TypeScript interfaces matching backend Purchase model (/backend/models/purchase.model.ts)
 *
 * Backend Model:
 * - Purchase { id, productId, quantity, unitCost, total, supplier, date, createdAt, updatedAt }
 *
 * These types ensure frontend-backend type safety.
 * API responses must conform to these interfaces.
 */

/**
 * Purchase - Represents a purchase order/receipt
 *
 * Records when inventory is purchased/restocked from a supplier
 * Automatically increases Product.stock
 *
 * Fields:
 * - id: Unique purchase identifier (UUID)
 * - productId: Reference to Product being purchased
 * - quantity: Number of units purchased
 * - unitCost: Cost per unit from supplier (in cents or major unit)
 * - total: quantity * unitCost (computed on backend)
 * - supplier: Supplier name or identifier
 * - date: When the purchase occurred (ISO 8601 datetime)
 *
 * Backend Route: GET /api/purchases
 * Response: Purchase[]
 *
 * Backend Controller: src/controllers/purchase.controller.ts
 */
export interface Purchase {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
  supplier: string;
  date: string; // ISO 8601 datetime
}

/**
 * PurchaseWithProduct - Purchase enriched with product information
 *
 * Convenience type for display that includes product details
 */
export interface PurchaseWithProduct extends Purchase {
  productName: string;
  sku: string;
}

/**
 * CreatePurchaseRequest - Request body for creating a purchase
 *
 * Backend Route: POST /api/purchases
 * Request body type
 *
 * Note: total is calculated on backend (quantity * unitCost)
 */
export interface CreatePurchaseRequest {
  productId: string;
  quantity: number;
  unitCost: number;
  supplier: string;
}

/**
 * PurchasesResponse - API response for fetching purchases list
 *
 * Backend Route: GET /api/purchases
 * Response body type
 *
 * Optional filters:
 * - GET /api/purchases?startDate=2026-01-01&endDate=2026-12-31
 * - GET /api/purchases?productId=UUID
 * - GET /api/purchases?supplier=name
 */
export interface PurchasesResponse {
  data: Purchase[];
  total: number;
  totalCost: number;
  count: number;
}

/**
 * PurchaseStats - Purchase analytics/statistics
 *
 * Used on Dashboard for displaying purchase metrics
 *
 * Backend Route: GET /api/purchases/stats
 * Response body type
 */
export interface PurchaseStats {
  totalPurchases: number;
  totalCost: number;
  averageTransactionValue: number;
  transactionCount: number;
  lastPurchaseDate?: string;
}
