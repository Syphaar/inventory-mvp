import apiClient from "./apiClient";
import type {
  Sale,
  SaleWithProduct,
  CreateSaleRequest,
  SalesResponse,
  SalesStats,
} from "@/types/sale.types";

export const getAll = async (): Promise<Sale[]> => {
  const response = await apiClient.get<SalesResponse>("/sales");
  return response.data.data;
};

export const getById = async (id: string): Promise<Sale> => {
  const response = await apiClient.get<Sale>(`/sales/${id}`);
  return response.data;
};

export const create = async (data: CreateSaleRequest): Promise<Sale> => {
  const response = await apiClient.post<Sale>("/sales", data);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await apiClient.delete(`/sales/${id}`);
};

export const getStats = async (): Promise<SalesStats> => {
  const response = await apiClient.get<SalesStats>("/sales/stats");
  return response.data;
};

export const getByProductId = async (productId: string): Promise<Sale[]> => {
  const response = await apiClient.get<SalesResponse>(`/sales?productId=${productId}`);
  return response.data.data;
};

export const saleApi = {
  getAll,
  getById,
  create,
  delete: deleteSale,
  getStats,
  getByProductId,
};
