import apiClient from "./apiClient";
import type {
  Purchase,
  PurchaseWithProduct,
  CreatePurchaseRequest,
  PurchasesResponse,
  PurchaseStats,
} from "@/types/purchase.types";

export const getAll = async (): Promise<Purchase[]> => {
  const response = await apiClient.get<PurchasesResponse>("/purchases");
  return response.data.data;
};

export const getById = async (id: string): Promise<Purchase> => {
  const response = await apiClient.get<Purchase>(`/purchases/${id}`);
  return response.data;
};

export const create = async (data: CreatePurchaseRequest): Promise<Purchase> => {
  const response = await apiClient.post<Purchase>("/purchases", data);
  return response.data;
};

export const deletePurchase = async (id: string): Promise<void> => {
  await apiClient.delete(`/purchases/${id}`);
};

export const getStats = async (): Promise<PurchaseStats> => {
  const response = await apiClient.get<PurchaseStats>("/purchases/stats");
  return response.data;
};

export const getByProductId = async (productId: string): Promise<Purchase[]> => {
  const response = await apiClient.get<PurchasesResponse>(`/purchases?productId=${productId}`);
  return response.data.data;
};

export const purchaseApi = {
  getAll,
  getById,
  create,
  delete: deletePurchase,
  getStats,
  getByProductId,
};
