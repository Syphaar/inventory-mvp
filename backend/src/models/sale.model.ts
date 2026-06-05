import type { Sale } from "../types";
import { generateId } from "../utils/generate-id";

const sales: Sale[] = [];

export const saleModel = {
  findAll(): Sale[] {
    return sales;
  },

  findByProductId(productId: string): Sale[] {
    return sales.filter((sale) => sale.productId === productId);
  },

  findById(id: string): Sale | undefined {
    return sales.find((sale) => sale.id === id);
  },

  create(data: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    customer: string;
  }): Sale {
    const newSale: Sale = {
      id: generateId(),
      productId: data.productId,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      total: data.total,
      customer: data.customer,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    sales.push(newSale);
    return newSale;
  },

  remove(id: string): boolean {
    const index = sales.findIndex((sale) => sale.id === id);
    if (index === -1) return false;
    sales.splice(index, 1);
    return true;
  },

  clear(): void {
    sales.length = 0;
  },
};
