import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "@/lib/config";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const url = error.config?.url ?? "";

    if (
      error.response?.status === 401 &&
      !url.startsWith("/auth/login") &&
      !url.startsWith("/auth/register")
    ) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
