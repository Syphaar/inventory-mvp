export interface AdjustStockRequestDto {
  delta: number;
  reason?: string;
}

export interface SetStockRequestDto {
  quantity: number;
  reason?: string;
}

export interface StockItemResponseDto {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}
