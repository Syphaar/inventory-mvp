import type { Product } from "../types";
import { generateId } from "../utils/generate-id";

const products: Product[] = [];

export const productModel = {
  findAll(): Product[] {
    return products;
  },

  findById(id: string): Product | undefined {
    return products.find((product) => product.id === id);
  },

  create(data: {
    sku: string;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    lowStockThreshold: number;
    userId?: string;
  }): Product {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: generateId(),
      userId: data.userId ?? "",
      sku: data.sku,
      name: data.name,
      category: data.category,
      price: data.price,
      cost: data.cost,
      stock: data.stock,
      lowStockThreshold: data.lowStockThreshold,
      createdAt: now,
      updatedAt: now,
    };
    products.push(newProduct);
    return newProduct;
  },

  update(
    id: string,
    data: Partial<{
      sku: string;
      name: string;
      category: string;
      price: number;
      cost: number;
      stock: number;
      lowStockThreshold: number;
    }>,
  ): Product | undefined {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return undefined;

    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return products[index];
  },

  remove(id: string): boolean {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },

  adjustStock(id: string, delta: number): Product | undefined {
    const product = products.find((p) => p.id === id);
    if (!product) return undefined;
    product.stock = Math.max(0, product.stock + delta);
    product.updatedAt = new Date().toISOString();
    return product;
  },

  setStock(id: string, value: number): Product | undefined {
    const product = products.find((p) => p.id === id);
    if (!product) return undefined;
    product.stock = Math.max(0, value);
    product.updatedAt = new Date().toISOString();
    return product;
  },

  clear(): void {
    products.length = 0;
  },
};
