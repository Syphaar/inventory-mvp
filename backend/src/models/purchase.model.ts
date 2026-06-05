import { prisma } from "../lib/prisma";
import type { Purchase } from "../types";

export const purchaseModel = {
  async findAll(): Promise<Purchase[]> {
    const purchases = await prisma.purchase.findMany();
    return purchases.map(toPurchase);
  },

  async findByProductId(productId: string): Promise<Purchase[]> {
    const purchases = await prisma.purchase.findMany({ where: { productId } });
    return purchases.map(toPurchase);
  },

  async findById(id: string): Promise<Purchase | undefined> {
    const purchase = await prisma.purchase.findUnique({ where: { id } });
    return purchase ? toPurchase(purchase) : undefined;
  },

  async create(data: {
    productId: string;
    quantity: number;
    unitCost: number;
    total: number;
    supplier: string;
    date?: string;
  }): Promise<Purchase> {
    const purchase = await prisma.purchase.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        unitCost: data.unitCost,
        total: data.total,
        supplier: data.supplier,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
    return toPurchase(purchase);
  },

  async remove(id: string): Promise<boolean> {
    try {
      await prisma.purchase.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  async clear(): Promise<void> {
    await prisma.purchase.deleteMany();
  },
};

function toPurchase(p: {
  id: string; productId: string; quantity: number; unitCost: number;
  total: number; supplier: string; date: Date; createdAt: Date;
}): Purchase {
  return {
    id: p.id,
    productId: p.productId,
    quantity: p.quantity,
    unitCost: p.unitCost,
    total: p.total,
    supplier: p.supplier,
    date: p.date.toISOString(),
    createdAt: p.createdAt.toISOString(),
  };
}
