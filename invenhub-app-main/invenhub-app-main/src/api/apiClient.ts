/**
 * Axios API Client
 *
 * Centralized HTTP client for all API requests to the backend.
 * Automatically handles:
 * - JWT token authentication
 * - Request/response interceptors
 * - Error handling
 * - Base URL configuration
 *
 * Backend Base URL: /api (configured for backend at http://localhost:3000/api)
 *
 * Features:
 * - Automatically attaches JWT token from localStorage to all requests
 * - Handles 401 (Unauthorized) responses by clearing token
 * - Supports JSON request/response bodies
 * - Includes Axios types for autocomplete
 *
 * Usage:
 * import { apiClient } from '@/api/apiClient';
 *
 * // GET request
 * const data = await apiClient.get('/products');
 *
 * // POST request with JSON body
 * const result = await apiClient.post('/sales', { productId, quantity });
 *
 * // PUT request
 * await apiClient.put(`/products/${id}`, { name, price });
 *
 * // DELETE request
 * await apiClient.delete(`/products/${id}`);
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Create Axios instance with default configuration
 *
 * Configuration:
 * - baseURL: '/api' - All requests prefixed with /api
 * - timeout: 10000ms - Request timeout
 * - headers: JSON content type for requests
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 *
 * Runs before every API request.
 * Attaches JWT token from localStorage to Authorization header.
 *
 * Format: Authorization: Bearer <token>
 *
 * This ensures all API requests are authenticated if a token exists.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem("auth_token");

    // Attach token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 *
 * Runs after every API response.
 * Handles errors and performs cleanup:
 * - 401: Token expired or invalid - clear localStorage and redirect to login
 * - Other errors: Pass through to caller
 *
 * Success responses are passed through unchanged.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Success response - return as-is
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      // Redirect to login page
      window.location.href = "/login";
    }

    // Return error for caller to handle
    return Promise.reject(error);
  },
);

/**
 * Export the configured API client
 * Use this in API service functions
 *
 * Example service function:
 *
 * export const getProducts = async () => {
 *   const response = await apiClient.get<Product[]>('/products');
 *   return response.data;
 * };
 */
export default apiClient;
