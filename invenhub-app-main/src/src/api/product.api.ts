/**
 * Product API Service
 *
 * Handles all product-related API calls to the backend.
 *
 * Backend Routes:
 * - GET /api/products - List all products
 * - GET /api/products/:id - Get product by ID
 * - POST /api/products - Create product
 * - PUT /api/products/:id - Update product
 * - DELETE /api/products/:id - Delete product
 *
 * Backend Controller: src/controllers/product.controller.ts
 * Backend Model: src/models/product.model.ts
 *
 * All functions use the centralized apiClient (src/api/apiClient.ts)
 * which automatically attaches JWT tokens to requests.
 */

import apiClient from "./apiClient";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
} from "@/types/product.types";

/**
 * Get All Products
 *
 * Backend Route: GET /api/products
 * Response: { data: Product[]; total: number }
 *
 * Retrieves complete list of all products with their current stock levels.
 *
 * Usage:
 * const products = await productApi.getAll();
 *
 * Optional query parameters:
 * - GET /api/products?category=Electronics
 * - GET /api/products?search=headphones
 *
 * @returns All products in the system
 * @throws AxiosError if not authenticated or server error
 */
export const getAll = async (): Promise<Product[]> => {
  const response = await apiClient.get<ProductsResponse>("/products");
  return response.data.data;
};

/**
 * Get Product By ID
 *
 * Backend Route: GET /api/products/:id
 * Response: Product object
 *
 * Retrieves detailed information for a specific product.
 *
 * Usage:
 * const product = await productApi.getById('product-uuid');
 *
 * @param id - Product ID (UUID)
 * @returns Product object with full details
 * @throws AxiosError if product not found (404) or not authenticated
 */
export const getById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

/**
 * Create New Product
 *
 * Backend Route: POST /api/products
 * Request: CreateProductRequest object
 * Response: Created Product object
 *
 * Creates a new product in the inventory system.
 *
 * Usage:
 * const newProduct = await productApi.create({
 *   sku: 'ELC-001',
 *   name: 'Wireless Headphones',
 *   category: 'Electronics',
 *   price: 129,
 *   cost: 65,
 *   stock: 50,
 *   lowStockThreshold: 10
 * });
 *
 * Backend Validation:
 * - SKU must be unique
 * - Price and cost must be positive
 * - Stock must be non-negative
 *
 * @param data - Product creation data
 * @returns Created product with generated ID
 * @throws AxiosError if validation fails (400) or not authenticated
 */
export const create = async (data: CreateProductRequest): Promise<Product> => {
  const response = await apiClient.post<Product>("/products", data);
  return response.data;
};

/**
 * Update Product
 *
 * Backend Route: PUT /api/products/:id
 * Request: UpdateProductRequest object (partial fields)
 * Response: Updated Product object
 *
 * Updates product information. Only provided fields are updated.
 *
 * Usage:
 * const updated = await productApi.update('product-uuid', {
 *   price: 139,
 *   lowStockThreshold: 15
 * });
 *
 * Note: To adjust stock, use Stock API endpoints (see stock.api.ts)
 *
 * @param id - Product ID (UUID)
 * @param data - Fields to update (all optional)
 * @returns Updated product object
 * @throws AxiosError if product not found (404), validation fails (400), or not authenticated
 */
export const update = async (id: string, data: UpdateProductRequest): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
};

/**
 * Delete Product
 *
 * Backend Route: DELETE /api/products/:id
 * Response: { success: true }
 *
 * Removes product from inventory system.
 * Also removes associated sales and purchase records.
 *
 * Usage:
 * await productApi.delete('product-uuid');
 *
 * Backend Behavior:
 * - Deletes product record
 * - Cascades to delete associated sales records
 * - Cascades to delete associated purchase records
 *
 * @param id - Product ID (UUID)
 * @throws AxiosError if product not found (404) or not authenticated
 */
export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

export const productApi = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProduct,
};
