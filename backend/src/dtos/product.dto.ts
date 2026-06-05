export interface CreateProductRequestDto {
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
}

export interface UpdateProductRequestDto {
  sku?: string;
  name?: string;
  category?: string;
  price?: number;
  cost?: number;
  stock?: number;
  lowStockThreshold?: number;
}

export interface ProductResponseDto {
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
