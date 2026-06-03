import apiClient from "./apiClient";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
} from "@/types/product.types";

export const getAll = async (): Promise<Product[]> => {
  const response = await apiClient.get<ProductsResponse>("/products");
  return response.data.data;
};

export const getById = async (id: string): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const create = async (data: CreateProductRequest): Promise<Product> => {
  const response = await apiClient.post<Product>("/products", data);
  return response.data;
};

export const update = async (id: string, data: UpdateProductRequest): Promise<Product> => {
  const response = await apiClient.put<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};

export const productApi = {
  getAll,
  getById,
  create,
  update,
  delete: deleteProduct,
};
