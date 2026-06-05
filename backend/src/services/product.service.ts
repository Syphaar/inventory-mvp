import { productModel } from "../models/product.model";
import { saleModel } from "../models/sale.model";
import { purchaseModel } from "../models/purchase.model";
import type { ProductResponseDto } from "../dtos/product.dto";
import type { CreateProductRequestDto, UpdateProductRequestDto } from "../dtos/product.dto";

export const productService = {
  getAll(): { data: ProductResponseDto[]; total: number } {
    const products = productModel.findAll();
    const data = products.map(mapToProductResponse);
    return { data, total: data.length };
  },

  getById(id: string): ProductResponseDto {
    const product = productModel.findById(id);

    if (!product) {
      throwObject("Product not found", 404);
    }

    return mapToProductResponse(product);
  },

  create(input: CreateProductRequestDto & { userId: string }): ProductResponseDto {
    const product = productModel.create({
      sku: input.sku,
      name: input.name,
      category: input.category,
      price: input.price,
      cost: input.cost,
      stock: input.stock,
      lowStockThreshold: input.lowStockThreshold,
      userId: input.userId,
    });

    return mapToProductResponse(product);
  },

  update(id: string, input: UpdateProductRequestDto): ProductResponseDto {
    const existingProduct = productModel.findById(id);

    if (!existingProduct) {
      throwObject("Product not found", 404);
    }

    const updatedProduct = productModel.update(id, input);

    if (!updatedProduct) {
      throwObject("Product not found", 404);
    }

    return mapToProductResponse(updatedProduct);
  },

  remove(id: string): void {
    const existingProduct = productModel.findById(id);

    if (!existingProduct) {
      throwObject("Product not found", 404);
    }

    const relatedSales = saleModel.findByProductId(id);
    for (const sale of relatedSales) {
      saleModel.remove(sale.id);
    }

    const relatedPurchases = purchaseModel.findByProductId(id);
    for (const purchase of relatedPurchases) {
      purchaseModel.remove(purchase.id);
    }

    productModel.remove(id);
  },
};

function mapToProductResponse(product: any): ProductResponseDto {
  return {
    id: product.id,
    userId: product.userId,
    sku: product.sku,
    name: product.name,
    category: product.category,
    price: product.price,
    cost: product.cost,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function throwObject(message: string, statusCode: number): never {
  const error: any = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
