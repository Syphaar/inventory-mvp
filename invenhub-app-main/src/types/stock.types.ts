import type { Product } from "./product.types";

export interface StockItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface AdjustStockRequest {
  delta: number;
  reason?: string;
}

export interface SetStockRequest {
  quantity: number;
  reason?: string;
}

export interface StockResponse {
  data: StockItem[];
  total: number;
  lowStockCount: number;
}
