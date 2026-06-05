import { saleModel } from "../models/sale.model";
import { productModel } from "../models/product.model";
import type { SaleResponseDto, SalesStatsResponseDto } from "../dtos/sale.dto";
import type { CreateSaleRequestDto } from "../dtos/sale.dto";

async function getUserProductIds(userId: string): Promise<string[]> {
  const products = await productModel.findByUserId(userId);
  return products.map((p) => p.id);
}

export const saleService = {
  async getAll(productId: string | undefined, userId: string): Promise<{
    data: SaleResponseDto[];
    total: number;
    totalRevenue: number;
    count: number;
  }> {
    const userProductIds = await getUserProductIds(userId);
    let sales = (await saleModel.findAll()).filter((s) => userProductIds.includes(s.productId));

    if (productId) {
      sales = sales.filter((sale) => sale.productId === productId);
    }

    const data = sales.map(mapToSaleResponse);
    const totalRevenue = data.reduce((sum, sale) => sum + sale.total, 0);

    return {
      data,
      total: data.length,
      totalRevenue,
      count: data.length,
    };
  },

  async getById(id: string, userId: string): Promise<SaleResponseDto> {
    const sale = await saleModel.findById(id);

    if (!sale) {
      throwObject("Sale not found", 404);
    }

    const product = await productModel.findById(sale.productId);
    if (!product || product.userId !== userId) {
      throwObject("Sale not found", 404);
    }

    return mapToSaleResponse(sale);
  },

  async create(input: CreateSaleRequestDto, userId: string): Promise<SaleResponseDto> {
    const product = await productModel.findById(input.productId);

    if (!product || product.userId !== userId) {
      throwObject("Product not found", 404);
    }

    if (product.stock < input.quantity) {
      throwObject("Insufficient stock. Available: " + product.stock, 400);
    }

    const total = input.quantity * input.unitPrice;

    const sale = await saleModel.create({
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      total,
      customer: input.customer,
    });

    await productModel.adjustStock(input.productId, -input.quantity);

    return mapToSaleResponse(sale);
  },

  async remove(id: string, userId: string): Promise<void> {
    const sale = await saleModel.findById(id);

    if (!sale) {
      throwObject("Sale not found", 404);
    }

    const product = await productModel.findById(sale.productId);
    if (!product || product.userId !== userId) {
      throwObject("Sale not found", 404);
    }

    await productModel.adjustStock(sale.productId, sale.quantity);
    await saleModel.remove(id);
  },

  async getStats(userId: string): Promise<SalesStatsResponseDto> {
    const userProductIds = await getUserProductIds(userId);
    const sales = (await saleModel.findAll()).filter((s) => userProductIds.includes(s.productId));

    if (sales.length === 0) {
      return {
        totalSales: 0,
        totalRevenue: 0,
        averageTransactionValue: 0,
        transactionCount: 0,
        lastSaleDate: null,
      };
    }

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const dates = sales.map((sale) => sale.date).sort();

    return {
      totalSales: sales.length,
      totalRevenue,
      averageTransactionValue: totalRevenue / sales.length,
      transactionCount: sales.length,
      lastSaleDate: dates[dates.length - 1],
    };
  },
};

function mapToSaleResponse(sale: any): SaleResponseDto {
  return {
    id: sale.id,
    productId: sale.productId,
    quantity: sale.quantity,
    unitPrice: sale.unitPrice,
    total: sale.total,
    customer: sale.customer,
    date: sale.date,
    createdAt: sale.createdAt,
  };
}

function throwObject(message: string, statusCode: number): never {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
