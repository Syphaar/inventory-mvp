/**
 * Type Exports Index
 *
 * Centralized export of all TypeScript types/interfaces.
 * Simplifies imports throughout the application.
 *
 * Usage:
 * import type { User, Product, Sale } from '@/types';
 *
 * Instead of:
 * import type { User } from '@/types/auth.types';
 * import type { Product } from '@/types/product.types';
 * import type { Sale } from '@/types/sale.types';
 */

// Authentication types
export type { User, LoginRequest, RegisterRequest, AuthResponse } from "./auth.types";

// Product types
export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
} from "./product.types";

// Stock types
export type { StockItem, AdjustStockRequest, SetStockRequest, StockResponse } from "./stock.types";

// Sale types
export type {
  Sale,
  SaleWithProduct,
  CreateSaleRequest,
  SalesResponse,
  SalesStats,
} from "./sale.types";

// Purchase types
export type {
  Purchase,
  PurchaseWithProduct,
  CreatePurchaseRequest,
  PurchasesResponse,
  PurchaseStats,
} from "./purchase.types";
