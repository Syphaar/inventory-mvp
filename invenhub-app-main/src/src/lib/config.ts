/**
 * Application Configuration
 *
 * Central configuration for the entire application.
 * Includes API settings, feature flags, and environment variables.
 *
 * Environment Variables (from .env):
 * - VITE_API_URL - Backend API base URL (default: /api)
 * - VITE_APP_NAME - Application name
 * - VITE_ENV - Environment (development, production)
 */

/**
 * API Configuration
 *
 * Base URL for all API requests
 * Default to /api for relative requests (backend on same server)
 * Override with VITE_API_URL environment variable
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
};

/**
 * App Configuration
 */
export const APP_CONFIG = {
  name: "Inventory MVP",
  version: "1.0.0",
  environment: import.meta.env.MODE,
};

/**
 * Feature Flags
 *
 * Control feature availability across the application
 */
export const FEATURES = {
  enablePurchases: true,
  enableSales: true,
  enableStockTracking: true,
  enableAnalytics: true,
  enableExports: false, // Coming soon
};

/**
 * Local Storage Keys
 *
 * Consistent keys for storing data in localStorage
 */
export const STORAGE_KEYS = {
  authToken: "auth_token",
  authUser: "auth_user",
  userPreferences: "user_preferences",
};
