import { purchaseModel } from "../models/purchase.model";
import { productModel } from "../models/product.model";
import type { PurchaseResponseDto, PurchaseStatsResponseDto } from "../dtos/purchase.dto";
import type { CreatePurchaseRequestDto } from "../dtos/purchase.dto";

export const purchaseService = {
  getAll(productId?: string): {
    data: PurchaseResponseDto[];
    total: number;
    totalCost: number;
    count: number;
  } {
    let purchases = purchaseModel.findAll();

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

  getById(id: string): PurchaseResponseDto {
    const purchase = purchaseModel.findById(id);

    if (!purchase) {
      throwObject("Purchase not found", 404);
    }

    return mapToPurchaseResponse(purchase);
  },

  create(input: CreatePurchaseRequestDto): PurchaseResponseDto {
    const product = productModel.findById(input.productId);

    if (!product) {
      throwObject("Product not found", 404);
    }

    const total = input.quantity * input.unitCost;

    const purchase = purchaseModel.create({
      productId: input.productId,
      quantity: input.quantity,
      unitCost: input.unitCost,
      total,
      supplier: input.supplier,
    });

    productModel.adjustStock(input.productId, input.quantity);

    return mapToPurchaseResponse(purchase);
  },

  remove(id: string): void {
    const purchase = purchaseModel.findById(id);

    if (!purchase) {
      throwObject("Purchase not found", 404);
    }

    productModel.adjustStock(purchase.productId, -purchase.quantity);
    purchaseModel.remove(id);
  },

  getStats(): PurchaseStatsResponseDto {
    const purchases = purchaseModel.findAll();

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
