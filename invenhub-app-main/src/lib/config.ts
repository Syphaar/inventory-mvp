function getApiBaseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  if (!apiUrl) {
    return "/api";
  }

  return apiUrl.endsWith("/api") ? apiUrl : `${apiUrl}/api`;
}

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 10000,
};

export const APP_CONFIG = {
  name: "Inventory MVP",
  version: "1.0.0",
  environment: import.meta.env.MODE,
};

export const FEATURES = {
  enablePurchases: true,
  enableSales: true,
  enableStockTracking: true,
  enableAnalytics: true,
  enableExports: false,
};

export const STORAGE_KEYS = {
  authToken: "auth_token",
  authUser: "auth_user",
  userPreferences: "user_preferences",
};
