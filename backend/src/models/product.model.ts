import { prisma } from "../lib/prisma";
import type { Product } from "../types";

export const productModel = {
  async findAll(): Promise<Product[]> {
    const products = await prisma.product.findMany();
    return products.map(toProduct);
  },

  async findById(id: string): Promise<Product | undefined> {
    const product = await prisma.product.findUnique({ where: { id } });
    return product ? toProduct(product) : undefined;
  },

  async findByUserId(userId: string): Promise<Product[]> {
    const products = await prisma.product.findMany({ where: { userId } });
    return products.map(toProduct);
  },

  async create(data: {
    sku: string;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    lowStockThreshold: number;
    userId?: string;
  }): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        name: data.name,
        category: data.category,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
        userId: data.userId ?? "",
      },
    });
    return toProduct(product);
  },

  async update(
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
  ): Promise<Product | undefined> {
    try {
      const product = await prisma.product.update({ where: { id }, data });
      return toProduct(product);
    } catch {
      return undefined;
    }
  },

  async remove(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  async adjustStock(id: string, delta: number): Promise<Product | undefined> {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: { stock: { increment: delta } },
      });
      if (product.stock < 0) {
        await prisma.product.update({
          where: { id },
          data: { stock: 0 },
        });
        return toProduct({ ...product, stock: 0 });
      }
      return toProduct(product);
    } catch {
      return undefined;
    }
  },

  async setStock(id: string, value: number): Promise<Product | undefined> {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: { stock: Math.max(0, value) },
      });
      return toProduct(product);
    } catch {
      return undefined;
    }
  },

  async clear(): Promise<void> {
    await prisma.product.deleteMany();
  },
};

function toProduct(p: {
  id: string; userId: string; sku: string; name: string; category: string;
  price: number; cost: number; stock: number; lowStockThreshold: number;
  createdAt: Date | string | null; updatedAt: Date | string | null;
}): Product {
  return {
    id: p.id,
    userId: p.userId,
    sku: p.sku,
    name: p.name,
    category: p.category,
    price: p.price,
    cost: p.cost,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold,
    createdAt: toIsoString(p.createdAt),
    updatedAt: toIsoString(p.updatedAt),
  };
}

function toIsoString(value: Date | string | null): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  }

  return new Date().toISOString();
}
