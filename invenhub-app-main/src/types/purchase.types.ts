export interface Purchase {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
  total: number;
  supplier: string;
  date: string;
  createdAt: string;
}

export interface PurchaseWithProduct extends Purchase {
  productName: string;
  sku: string;
}

export interface CreatePurchaseRequest {
  productId: string;
  quantity: number;
  unitCost: number;
  supplier: string;
}

export interface PurchasesResponse {
  data: Purchase[];
  total: number;
  totalCost: number;
  count: number;
}

export interface PurchaseStats {
  totalPurchases: number;
  totalCost: number;
  averageTransactionValue: number;
  transactionCount: number;
  lastPurchaseDate: string | null;
}
