import apiClient from "./apiClient";
import type { ApiResponse, AuthResponseData, User } from "@/types/auth.types";

export const login = async (email: string, password: string): Promise<AuthResponseData> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>("/auth/login", {
    email,
    password,
  });
  return response.data.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponseData> => {
  const response = await apiClient.post<ApiResponse<AuthResponseData>>("/auth/register", {
    name,
    email,
    password,
  });
  return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>("/auth/me");
  return response.data.data;
};

export const authApi = {
  login,
  register,
  getCurrentUser,
};
