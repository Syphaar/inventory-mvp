/**
 * Product Types
 *
 * TypeScript interfaces matching backend Product model (/backend/models/product.model.ts)
 *
 * Backend Model:
 * - Product { id, sku, name, category, price, cost, stock, lowStockThreshold, createdAt, updatedAt }
 *
 * These types ensure frontend-backend type safety.
 * API responses must conform to these interfaces.
 */

/**
 * Product - Core product entity
 *
 * Represents an inventory product with pricing, cost, and stock information.
 *
 * Fields:
 * - id: Unique product identifier (UUID)
 * - sku: Stock Keeping Unit - unique product code
 * - name: Product name/title
 * - category: Product category for organization
 * - price: Retail/selling price per unit (in cents or major unit)
 * - cost: Wholesale/production cost per unit
 * - stock: Current quantity in inventory
 * - lowStockThreshold: Threshold for low stock alerts
 *
 * Backend Route: GET /api/products
 * Response: Product[]
 *
 * Backend Controller: src/controllers/product.controller.ts
 */
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
}

/**
 * CreateProductRequest - Request body for creating product
 *
 * Backend Route: POST /api/products
 * Request body type
 */
export interface CreateProductRequest {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
}

/**
 * UpdateProductRequest - Request body for updating product
 *
 * Backend Route: PUT /api/products/:id
 * Request body type - all fields optional
 */
export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  lowStockThreshold?: number;
}

/**
 * ProductsResponse - API response for fetching products list
 *
 * Backend Route: GET /api/products
 * Response body type
 */
export interface ProductsResponse {
  data: Product[];
  total: number;
}
