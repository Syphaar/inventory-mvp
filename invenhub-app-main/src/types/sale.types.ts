export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  date: string;
}

export interface SaleWithProduct extends Sale {
  productName: string;
  sku: string;
}

export interface CreateSaleRequest {
  productId: string;
  quantity: number;
  unitPrice: number;
  customer: string;
}

export interface SalesResponse {
  data: Sale[];
  total: number;
  totalRevenue: number;
  count: number;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageTransactionValue: number;
  transactionCount: number;
  lastSaleDate?: string;
}
