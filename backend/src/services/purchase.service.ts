import { purchaseModel } from "../models/purchase.model";
import { productModel } from "../models/product.model";
import type { PurchaseResponseDto, PurchaseStatsResponseDto } from "../dtos/purchase.dto";
import type { CreatePurchaseRequestDto } from "../dtos/purchase.dto";

async function getUserProductIds(userId: string): Promise<string[]> {
  const products = await productModel.findByUserId(userId);
  return products.map((p) => p.id);
}

export const purchaseService = {
  async getAll(productId: string | undefined, userId: string): Promise<{
    data: PurchaseResponseDto[];
    total: number;
    totalCost: number;
    count: number;
  }> {
    const userProductIds = await getUserProductIds(userId);
    let purchases = (await purchaseModel.findAll()).filter((p) => userProductIds.includes(p.productId));

    if (productId) {
      purchases = purchases.filter((purchase) => purchase.productId === productId);
    }

    const data = purchases.map(mapToPurchaseResponse);
    const totalCost = data.reduce((sum, purchase) => sum + purchase.total, 0);

    return {
      data,
      total: data.length,
      totalCost,
      count: data.length,
    };
  },

  async getById(id: string, userId: string): Promise<PurchaseResponseDto> {
    const purchase = await purchaseModel.findById(id);

    if (!purchase) {
      throwObject("Purchase not found", 404);
    }

    const product = await productModel.findById(purchase.productId);
    if (!product || product.userId !== userId) {
      throwObject("Purchase not found", 404);
    }

    return mapToPurchaseResponse(purchase);
  },

  async create(input: CreatePurchaseRequestDto, userId: string): Promise<PurchaseResponseDto> {
    const product = await productModel.findById(input.productId);

    if (!product || product.userId !== userId) {
      throwObject("Product not found", 404);
    }

    const total = input.quantity * input.unitCost;

    const purchase = await purchaseModel.create({
      productId: input.productId,
      quantity: input.quantity,
      unitCost: input.unitCost,
      total,
      supplier: input.supplier,
    });

    await productModel.adjustStock(input.productId, input.quantity);

    return mapToPurchaseResponse(purchase);
  },

  async remove(id: string, userId: string): Promise<void> {
    const purchase = await purchaseModel.findById(id);

    if (!purchase) {
      throwObject("Purchase not found", 404);
    }

    const product = await productModel.findById(purchase.productId);
    if (!product || product.userId !== userId) {
      throwObject("Purchase not found", 404);
    }

    await productModel.adjustStock(purchase.productId, -purchase.quantity);
    await purchaseModel.remove(id);
  },

  async getStats(userId: string): Promise<PurchaseStatsResponseDto> {
    const userProductIds = await getUserProductIds(userId);
    const purchases = (await purchaseModel.findAll()).filter((p) => userProductIds.includes(p.productId));

    if (purchases.length === 0) {
      return {
        totalPurchases: 0,
        totalCost: 0,
        averageTransactionValue: 0,
        transactionCount: 0,
        lastPurchaseDate: null,
      };
    }

    const totalCost = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
    const dates = purchases.map((purchase) => purchase.date).sort();

    return {
      totalPurchases: purchases.length,
      totalCost,
      averageTransactionValue: totalCost / purchases.length,
      transactionCount: purchases.length,
      lastPurchaseDate: dates[dates.length - 1],
    };
  },
};

function mapToPurchaseResponse(purchase: any): PurchaseResponseDto {
  return {
    id: purchase.id,
    productId: purchase.productId,
    quantity: purchase.quantity,
    unitCost: purchase.unitCost,
    total: purchase.total,
    supplier: purchase.supplier,
    date: purchase.date,
    createdAt: purchase.createdAt,
  };
}

function throwObject(message: string, statusCode: number): never {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
