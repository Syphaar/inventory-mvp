/**
 * Authentication API Service
 *
 * Handles all authentication-related API calls to the backend.
 *
 * Backend Routes:
 * - POST /api/auth/login
 * - POST /api/auth/register
 * - POST /api/auth/logout
 * - GET /api/auth/me
 *
 * All functions use the centralized apiClient (src/api/apiClient.ts)
 * which automatically attaches JWT tokens to requests.
 */

import apiClient from "./apiClient";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "@/types/auth.types";

/**
 * Login User
 *
 * Backend Route: POST /api/auth/login
 * Request: { email: string; password: string }
 * Response: { user: User; accessToken: string }
 *
 * Usage:
 * const { user, accessToken } = await authApi.login('user@example.com', 'password');
 *
 * @param email - User email address
 * @param password - User password
 * @returns AuthResponse with user and JWT token
 * @throws AxiosError if login fails (401, 400)
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  } as LoginRequest);
  return response.data;
};

/**
 * Register New User
 *
 * Backend Route: POST /api/auth/register
 * Request: { name: string; email: string; password: string }
 * Response: { user: User; accessToken: string }
 *
 * Usage:
 * const { user, accessToken } = await authApi.register('John', 'john@example.com', 'password');
 *
 * @param name - User full name
 * @param email - User email address
 * @param password - User password
 * @returns AuthResponse with user and JWT token
 * @throws AxiosError if registration fails (400 - duplicate email)
 */
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

/**
 * Get Current User Profile
 *
 * Backend Route: GET /api/auth/me
 * Request: Authorization header with JWT token
 * Response: User object
 *
 * Usage:
 * const user = await authApi.getCurrentUser();
 *
 * Requires valid JWT token in Authorization header
 * Token is automatically attached by apiClient interceptor
 *
 * @returns Current user profile
 * @throws AxiosError if not authenticated (401)
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me");
  return response.data;
};

/**
 * Logout User
 *
 * Backend Route: POST /api/auth/logout
 * Request: Authorization header with JWT token
 * Response: { success: true }
 *
 * Usage:
 * await authApi.logout();
 *
 * Optional: Backend can invalidate token on server side.
 * Frontend always clears token from localStorage.
 *
 * @throws AxiosError if logout fails
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const authApi = {
  login,
  register,
  getCurrentUser,
  logout,
};
