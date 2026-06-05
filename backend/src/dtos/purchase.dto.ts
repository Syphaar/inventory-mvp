export interface CreatePurchaseRequestDto {
  productId: string;
  quantity: number;
  unitCost: number;
  supplier: string;
}

export interface PurchaseResponseDto {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
  supplier: string;
  date: string;
  createdAt: string;
}

export interface PurchaseStatsResponseDto {
  totalPurchases: number;
  totalCost: number;
  averageTransactionValue: number;
  transactionCount: number;
  lastPurchaseDate: string | null;
}
