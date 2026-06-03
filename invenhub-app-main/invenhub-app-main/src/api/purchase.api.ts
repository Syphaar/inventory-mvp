/**
 * Purchase API Service
 *
 * Handles all purchase/restocking-related API calls to the backend.
 *
 * Backend Routes:
 * - GET /api/purchases - List all purchases
 * - GET /api/purchases/:id - Get purchase by ID
 * - POST /api/purchases - Create purchase (records transaction & increases stock)
 * - DELETE /api/purchases/:id - Delete purchase (reverses transaction & decreases stock)
 * - GET /api/purchases/stats - Get purchase statistics
 *
 * Backend Controller: src/controllers/purchase.controller.ts
 * Backend Model: src/models/purchase.model.ts
 *
 * Purchase Behavior:
 * - Creating a purchase automatically increases Product.stock
 * - Deleting a purchase automatically decreases Product.stock
 * - Total is calculated on backend (quantity * unitCost)
 *
 * All functions use the centralized apiClient (src/api/apiClient.ts)
 * which automatically attaches JWT tokens to requests.
 */

import apiClient from "./apiClient";
import type {
  Purchase,
  PurchaseWithProduct,
  CreatePurchaseRequest,
  PurchasesResponse,
  PurchaseStats,
} from "@/types/purchase.types";

/**
 * Get All Purchases
 *
 * Backend Route: GET /api/purchases
 * Response: { data: Purchase[]; total: number; totalCost: number; count: number }
 *
 * Retrieves complete list of all purchase transactions.
 *
 * Usage:
 * const purchases = await purchaseApi.getAll();
 *
 * Optional query parameters for filtering:
 * - GET /api/purchases?startDate=2026-01-01&endDate=2026-12-31 (date range)
 * - GET /api/purchases?productId=UUID (filter by product)
 * - GET /api/purchases?supplier=name (filter by supplier)
 * - GET /api/purchases?skip=0&take=50 (pagination)
 *
 * @returns All purchase transactions
 * @throws AxiosError if not authenticated or server error
 */
export const getAll = async (): Promise<Purchase[]> => {
  const response = await apiClient.get<PurchasesResponse>("/purchases");
  return response.data.data;
};

/**
 * Get Purchase By ID
 *
 * Backend Route: GET /api/purchases/:id
 * Response: Purchase object
 *
 * Retrieves details of a specific purchase transaction.
 *
 * Usage:
 * const purchase = await purchaseApi.getById('purchase-uuid');
 *
 * @param id - Purchase ID (UUID)
 * @returns Purchase object with full details
 * @throws AxiosError if purchase not found (404) or not authenticated
 */
export const getById = async (id: string): Promise<Purchase> => {
  const response = await apiClient.get<Purchase>(`/purchases/${id}`);
  return response.data;
};

/**
 * Create New Purchase
 *
 * Backend Route: POST /api/purchases
 * Request: CreatePurchaseRequest object
 * Response: Created Purchase object
 *
 * Records a new purchase/restock transaction.
 * Automatically increases quantity in Product.stock.
 *
 * Usage:
 * const newPurchase = await purchaseApi.create({
 *   productId: 'product-uuid',
 *   quantity: 100,
 *   unitCost: 50,
 *   supplier: 'TechSupply Inc'
 * });
 *
 * Backend Behavior:
 * - Validates product exists
 * - Calculates total = quantity * unitCost
 * - Adds quantity to product stock
 * - Records purchase with current timestamp
 *
 * Backend Validation:
 * - Product must exist
 * - Quantity must be positive
 * - Unit cost should be non-negative
 *
 * @param data - Purchase creation details
 * @returns Created purchase object with generated ID
 * @throws AxiosError if validation fails (400: product not found, invalid quantities) or not authenticated
 */
export const create = async (data: CreatePurchaseRequest): Promise<Purchase> => {
  const response = await apiClient.post<Purchase>("/purchases", data);
  return response.data;
};

/**
 * Delete Purchase (Reverse Transaction)
 *
 * Backend Route: DELETE /api/purchases/:id
 * Response: { success: true }
 *
 * Removes a purchase record and deducts the quantity from product stock.
 *
 * Usage:
 * await purchaseApi.delete('purchase-uuid');
 *
 * Backend Behavior:
 * - Finds and removes purchase record
 * - Subtracts the quantity from Product.stock
 * - Can be used for purchase cancellations or corrections
 *
 * Note: Resulting stock cannot go negative
 *
 * @param id - Purchase ID (UUID)
 * @throws AxiosError if purchase not found (404), would result in negative stock, or not authenticated
 */
export const deletePurchase = async (id: string): Promise<void> => {
  await apiClient.delete(`/purchases/${id}`);
};

/**
 * Get Purchase Statistics
 *
 * Backend Route: GET /api/purchases/stats
 * Response: PurchaseStats object
 *
 * Retrieves aggregated purchase metrics for dashboard and reporting.
 *
 * Usage:
 * const stats = await purchaseApi.getStats();
 * // { totalPurchases: 5, totalCost: 4500, ... }
 *
 * Optional query parameters:
 * - GET /api/purchases/stats?startDate=2026-01-01&endDate=2026-12-31 (date range)
 *
 * @returns Purchase statistics object
 * @throws AxiosError if not authenticated or server error
 */
export const getStats = async (): Promise<PurchaseStats> => {
  const response = await apiClient.get<PurchaseStats>("/purchases/stats");
  return response.data;
};

/**
 * Get Purchases for Product
 *
 * Backend Route: GET /api/purchases?productId=UUID
 * Response: Purchase[]
 *
 * Retrieves all purchases for a specific product.
 *
 * Usage:
 * const productPurchases = await purchaseApi.getByProductId('product-uuid');
 *
 * @param productId - Product ID (UUID)
 * @returns Purchases for the specified product
 * @throws AxiosError if not authenticated or server error
 */
export const getByProductId = async (productId: string): Promise<Purchase[]> => {
  const response = await apiClient.get<PurchasesResponse>(`/purchases?productId=${productId}`);
  return response.data.data;
};

export const purchaseApi = {
  getAll,
  getById,
  create,
  delete: deletePurchase,
  getStats,
  getByProductId,
};
