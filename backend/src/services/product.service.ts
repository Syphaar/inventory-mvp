import { productModel } from "../models/product.model";
import { saleModel } from "../models/sale.model";
import { purchaseModel } from "../models/purchase.model";
import type { ProductResponseDto } from "../dtos/product.dto";
import type { CreateProductRequestDto, UpdateProductRequestDto } from "../dtos/product.dto";

export const productService = {
  async getAll(userId: string): Promise<{ data: ProductResponseDto[]; total: number }> {
    const products = await productModel.findByUserId(userId);
    const data = products.map(mapToProductResponse);
    return { data, total: data.length };
  },

  async getById(id: string, userId: string): Promise<ProductResponseDto> {
    const product = await productModel.findById(id);

    if (!product || product.userId !== userId) {
      throwObject("Product not found", 404);
    }

    return mapToProductResponse(product);
  },

  async create(input: CreateProductRequestDto & { userId: string }): Promise<ProductResponseDto> {
    const sku = input.sku.trim();
    const existingProduct = await productModel.findBySkuForUser(sku, input.userId);

    if (existingProduct) {
      throwObject("A product with this SKU already exists", 409);
    }

    let product;
    try {
      product = await productModel.create({
        sku,
        name: input.name.trim(),
        category: input.category.trim(),
        price: input.price,
        cost: input.cost,
        stock: input.stock,
        lowStockThreshold: input.lowStockThreshold,
        userId: input.userId,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throwObject("A product with this SKU already exists", 409);
      }

      throw error;
    }

    return mapToProductResponse(product);
  },

  async update(id: string, input: UpdateProductRequestDto, userId: string): Promise<ProductResponseDto> {
    const existingProduct = await productModel.findById(id);

    if (!existingProduct || existingProduct.userId !== userId) {
      throwObject("Product not found", 404);
    }

    const updatedProduct = await productModel.update(id, input);

    if (!updatedProduct) {
      throwObject("Product not found", 404);
    }

    return mapToProductResponse(updatedProduct);
  },

  async remove(id: string, userId: string): Promise<void> {
    const existingProduct = await productModel.findById(id);

    if (!existingProduct || existingProduct.userId !== userId) {
      throwObject("Product not found", 404);
    }

    const relatedSales = await saleModel.findByProductId(id);
    for (const sale of relatedSales) {
      await saleModel.remove(sale.id);
    }

    const relatedPurchases = await purchaseModel.findByProductId(id);
    for (const purchase of relatedPurchases) {
      await purchaseModel.remove(purchase.id);
    }

    await productModel.remove(id);
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

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === "P2002";
}
