import apiClient from "./apiClient";
import type {
  StockItem,
  AdjustStockRequest,
  SetStockRequest,
  StockResponse,
} from "@/types/stock.types";
import type { ApiResponse } from "@/types/auth.types";

export const getAll = async (): Promise<StockItem[]> => {
  const response = await apiClient.get<StockResponse>("/stocks");
  return response.data.data;
};

export const adjustStock = async (
  productId: string,
  data: AdjustStockRequest,
): Promise<StockItem> => {
  const response = await apiClient.patch<ApiResponse<StockItem>>(
    `/stocks/${productId}/adjust`,
    data,
  );
  return response.data.data;
};

export const setStock = async (productId: string, data: SetStockRequest): Promise<StockItem> => {
  const response = await apiClient.patch<ApiResponse<StockItem>>(
    `/stocks/${productId}/set`,
    data,
  );
  return response.data.data;
};

export const getLowStock = async (): Promise<StockItem[]> => {
  const response = await apiClient.get<StockResponse>("/stocks?low=true");
  return response.data.data;
};

export const stockApi = {
  getAll,
  adjustStock,
  setStock,
  getLowStock,
};
