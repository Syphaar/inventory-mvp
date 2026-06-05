export interface CreateSaleRequestDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  customer: string;
}

export interface SaleResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  date: string;
  createdAt: string;
}

export interface SalesStatsResponseDto {
  totalSales: number;
  totalRevenue: number;
  averageTransactionValue: number;
  transactionCount: number;
  lastSaleDate: string | null;
}
