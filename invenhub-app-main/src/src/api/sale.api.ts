/**
 * Sales API Service
 *
 * Handles all sales-related API calls to the backend.
 *
 * Backend Routes:
 * - GET /api/sales - List all sales
 * - GET /api/sales/:id - Get sale by ID
 * - POST /api/sales - Create sale (records transaction & deducts stock)
 * - DELETE /api/sales/:id - Delete sale (reverses transaction & restores stock)
 * - GET /api/sales/stats - Get sales statistics
 *
 * Backend Controller: src/controllers/sale.controller.ts
 * Backend Model: src/models/sale.model.ts
 *
 * Sale Behavior:
 * - Creating a sale automatically deducts from Product.stock
 * - Deleting a sale automatically restores Product.stock
 * - Total is calculated on backend (quantity * unitPrice)
 *
 * All functions use the centralized apiClient (src/api/apiClient.ts)
 * which automatically attaches JWT tokens to requests.
 */

import apiClient from "./apiClient";
import type {
  Sale,
  SaleWithProduct,
  CreateSaleRequest,
  SalesResponse,
  SalesStats,
} from "@/types/sale.types";

/**
 * Get All Sales
 *
 * Backend Route: GET /api/sales
 * Response: { data: Sale[]; total: number; totalRevenue: number; count: number }
 *
 * Retrieves complete list of all sales transactions.
 *
 * Usage:
 * const sales = await saleApi.getAll();
 *
 * Optional query parameters for filtering:
 * - GET /api/sales?startDate=2026-01-01&endDate=2026-12-31 (date range)
 * - GET /api/sales?productId=UUID (filter by product)
 * - GET /api/sales?customer=name (filter by customer name)
 * - GET /api/sales?skip=0&take=50 (pagination)
 *
 * @returns All sales transactions
 * @throws AxiosError if not authenticated or server error
 */
export const getAll = async (): Promise<Sale[]> => {
  const response = await apiClient.get<SalesResponse>("/sales");
  return response.data.data;
};

/**
 * Get Sale By ID
 *
 * Backend Route: GET /api/sales/:id
 * Response: Sale object
 *
 * Retrieves details of a specific sale transaction.
 *
 * Usage:
 * const sale = await saleApi.getById('sale-uuid');
 *
 * @param id - Sale ID (UUID)
 * @returns Sale object with full details
 * @throws AxiosError if sale not found (404) or not authenticated
 */
export const getById = async (id: string): Promise<Sale> => {
  const response = await apiClient.get<Sale>(`/sales/${id}`);
  return response.data;
};

/**
 * Create New Sale
 *
 * Backend Route: POST /api/sales
 * Request: CreateSaleRequest object
 * Response: Created Sale object
 *
 * Records a new sale transaction.
 * Automatically deducts quantity from Product.stock.
 *
 * Usage:
 * const newSale = await saleApi.create({
 *   productId: 'product-uuid',
 *   quantity: 5,
 *   unitPrice: 129,
 *   customer: 'John Company'
 * });
 *
 * Backend Behavior:
 * - Validates product exists
 * - Checks sufficient stock available
 * - Calculates total = quantity * unitPrice
 * - Deducts quantity from product stock
 * - Records sale with current timestamp
 *
 * Backend Validation:
 * - Product must exist
 * - Quantity must be positive
 * - Quantity must not exceed available stock
 * - Unit price should be positive
 *
 * @param data - Sale creation details
 * @returns Created sale object with generated ID
 * @throws AxiosError if validation fails (400: insufficient stock, product not found, etc.) or not authenticated
 */
export const create = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await apiClient.post<Sale>("/sales", data);
  return response.data;
};

/**
 * Delete Sale (Reverse Transaction)
 *
 * Backend Route: DELETE /api/sales/:id
 * Response: { success: true }
 *
 * Removes a sale record and restores the deducted stock to the product.
 *
 * Usage:
 * await saleApi.delete('sale-uuid');
 *
 * Backend Behavior:
 * - Finds and removes sale record
 * - Adds the quantity back to Product.stock
 * - Can be used for refunds or corrections
 *
 * @param id - Sale ID (UUID)
 * @throws AxiosError if sale not found (404) or not authenticated
 */
export const deleteSale = async (id: string): Promise<void> => {
  await apiClient.delete(`/sales/${id}`);
};

/**
 * Get Sales Statistics
 *
 * Backend Route: GET /api/sales/stats
 * Response: SalesStats object
 *
 * Retrieves aggregated sales metrics for dashboard and reporting.
 *
 * Usage:
 * const stats = await saleApi.getStats();
 * // { totalSales: 1200, totalRevenue: 45600, ... }
 *
 * Optional query parameters:
 * - GET /api/sales/stats?startDate=2026-01-01&endDate=2026-12-31 (date range)
 *
 * @returns Sales statistics object
 * @throws AxiosError if not authenticated or server error
 */
export const getStats = async (): Promise<SalesStats> => {
  const response = await apiClient.get<SalesStats>("/sales/stats");
  return response.data;
};

/**
 * Get Sales for Product
 *
 * Backend Route: GET /api/sales?productId=UUID
 * Response: Sale[]
 *
 * Retrieves all sales for a specific product.
 *
 * Usage:
 * const productSales = await saleApi.getByProductId('product-uuid');
 *
 * @param productId - Product ID (UUID)
 * @returns Sales for the specified product
 * @throws AxiosError if not authenticated or server error
 */
export const getByProductId = async (productId: string): Promise<Sale[]> => {
  const response = await apiClient.get<SalesResponse>(`/sales?productId=${productId}`);
  return response.data.data;
};

export const saleApi = {
  getAll,
  getById,
  create,
  delete: deleteSale,
  getStats,
  getByProductId,
};
