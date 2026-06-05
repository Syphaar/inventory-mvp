import { prisma } from "../lib/prisma";
import type { Sale } from "../types";

export const saleModel = {
  async findAll(): Promise<Sale[]> {
    const sales = await prisma.sale.findMany();
    return sales.map(toSale);
  },

  async findByProductId(productId: string): Promise<Sale[]> {
    const sales = await prisma.sale.findMany({ where: { productId } });
    return sales.map(toSale);
  },

  async findById(id: string): Promise<Sale | undefined> {
    const sale = await prisma.sale.findUnique({ where: { id } });
    return sale ? toSale(sale) : undefined;
  },

  async create(data: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    customer: string;
    date?: string;
  }): Promise<Sale> {
    const sale = await prisma.sale.create({
      data: {
        productId: data.productId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        total: data.total,
        customer: data.customer,
        date: data.date ? new Date(data.date) : new Date(),
      },
    });
    return toSale(sale);
  },

  async remove(id: string): Promise<boolean> {
    try {
      await prisma.sale.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  async clear(): Promise<void> {
    await prisma.sale.deleteMany();
  },
};

function toSale(s: {
  id: string; productId: string; quantity: number; unitPrice: number;
  total: number; customer: string; date: Date; createdAt: Date;
}): Sale {
  return {
    id: s.id,
    productId: s.productId,
    quantity: s.quantity,
    unitPrice: s.unitPrice,
    total: s.total,
    customer: s.customer,
    date: s.date.toISOString(),
    createdAt: s.createdAt.toISOString(),
  };
}
