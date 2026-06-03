/**
 * API Services Index
 *
 * Centralized export of all API service functions.
 * Simplifies imports throughout the application.
 *
 * Usage:
 * import { productApi, saleApi } from '@/api';
 *
 * API Services Available:
 * - authApi - Authentication operations
 * - productApi - Product CRUD operations
 * - stockApi - Stock/inventory operations
 * - saleApi - Sales transaction operations
 * - purchaseApi - Purchase order operations
 */

export { authApi } from "./auth.api";
export { productApi } from "./product.api";
export { stockApi } from "./stock.api";
export { saleApi } from "./sale.api";
export { purchaseApi } from "./purchase.api";
export { default as apiClient } from "./apiClient";
