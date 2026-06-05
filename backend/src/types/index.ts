export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  customer: string;
  date: string;
  createdAt: string;
}

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

export interface SaleWithProduct extends Sale {
  productName: string;
  sku: string;
}

export interface PurchaseWithProduct extends Purchase {
  productName: string;
  sku: string;
}

export interface StockItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  quantity: number;
  lowStockThreshold: number;
  isLowStock: boolean;
}

export interface AuthPayload {
  userId: string;
  email: string;
}
