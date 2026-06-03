import apiClient from "./apiClient";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth.types";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  } as LoginRequest);
  return response.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  } as RegisterRequest);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const authApi = {
  login,
  register,
  getCurrentUser,
  logout,
};
