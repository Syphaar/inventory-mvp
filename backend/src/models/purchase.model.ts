import type { Purchase } from "../types";
import { generateId } from "../utils/generate-id";

const purchases: Purchase[] = [];

export const purchaseModel = {
  findAll(): Purchase[] {
    return purchases;
  },

  findByProductId(productId: string): Purchase[] {
    return purchases.filter((purchase) => purchase.productId === productId);
  },

  findById(id: string): Purchase | undefined {
    return purchases.find((purchase) => purchase.id === id);
  },

  create(data: {
    productId: string;
    quantity: number;
    unitCost: number;
    total: number;
    supplier: string;
  }): Purchase {
    const newPurchase: Purchase = {
      id: generateId(),
      productId: data.productId,
      quantity: data.quantity,
      unitCost: data.unitCost,
      total: data.total,
      supplier: data.supplier,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    purchases.push(newPurchase);
    return newPurchase;
  },

  remove(id: string): boolean {
    const index = purchases.findIndex((purchase) => purchase.id === id);
    if (index === -1) return false;
    purchases.splice(index, 1);
    return true;
  },

  clear(): void {
    purchases.length = 0;
  },
};
