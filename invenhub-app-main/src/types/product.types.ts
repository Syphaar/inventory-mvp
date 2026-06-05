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

export interface CreateProductRequest {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
}

export interface UpdateProductRequest {
  sku?: string;
  name?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  lowStockThreshold?: number;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
}
