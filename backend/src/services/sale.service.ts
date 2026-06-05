import { saleModel } from "../models/sale.model";
import { productModel } from "../models/product.model";
import type { SaleResponseDto, SalesStatsResponseDto } from "../dtos/sale.dto";
import type { CreateSaleRequestDto } from "../dtos/sale.dto";

export const saleService = {
  getAll(productId?: string): {
    data: SaleResponseDto[];
    total: number;
    totalRevenue: number;
    count: number;
  } {
    let sales = saleModel.findAll();

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

  getById(id: string): SaleResponseDto {
    const sale = saleModel.findById(id);

    if (!sale) {
      throwObject("Sale not found", 404);
    }

    return mapToSaleResponse(sale);
  },

  create(input: CreateSaleRequestDto): SaleResponseDto {
    const product = productModel.findById(input.productId);

    if (!product) {
      throwObject("Product not found", 404);
    }

    if (product.stock < input.quantity) {
      throwObject("Insufficient stock. Available: " + product.stock, 400);
    }

    const total = input.quantity * input.unitPrice;

    const sale = saleModel.create({
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      total,
      customer: input.customer,
    });

    productModel.adjustStock(input.productId, -input.quantity);

    return mapToSaleResponse(sale);
  },

  remove(id: string): void {
    const sale = saleModel.findById(id);

    if (!sale) {
      throwObject("Sale not found", 404);
    }

    productModel.adjustStock(sale.productId, sale.quantity);
    saleModel.remove(id);
  },

  getStats(): SalesStatsResponseDto {
    const sales = saleModel.findAll();

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
