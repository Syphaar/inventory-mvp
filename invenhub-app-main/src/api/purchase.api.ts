import apiClient from "./apiClient";
import type {
  Purchase,
  CreatePurchaseRequest,
  PurchasesResponse,
  PurchaseStats,
} from "@/types/purchase.types";
import type { ApiResponse } from "@/types/auth.types";

export const getAll = async (): Promise<Purchase[]> => {
  const response = await apiClient.get<PurchasesResponse>("/purchases");
  return response.data.data;
};

export const getById = async (id: string): Promise<Purchase> => {
  const response = await apiClient.get<ApiResponse<Purchase>>(`/purchases/${id}`);
  return response.data.data;
};

export const create = async (data: CreatePurchaseRequest): Promise<Purchase> => {
  const response = await apiClient.post<ApiResponse<Purchase>>("/purchases", data);
  return response.data.data;
};

export const deletePurchase = async (id: string): Promise<void> => {
  await apiClient.delete(`/purchases/${id}`);
};

export const getStats = async (): Promise<PurchaseStats> => {
  const response = await apiClient.get<ApiResponse<PurchaseStats>>("/purchases/stats");
  return response.data.data;
};

export const purchaseApi = {
  getAll,
  getById,
  create,
  delete: deletePurchase,
  getStats,
};
