/**
 * Authentication Context
 *
 * Provides global authentication state and methods throughout the application.
 * Manages user authentication, token persistence, and login/logout functionality.
 *
 * Features:
 * - User state management
 * - JWT token storage and retrieval
 * - Login/Register/Logout operations
 * - Token persistence in localStorage
 * - Loading states for async operations
 *
 * Backend Integration:
 * - POST /api/auth/login - Authenticates user with email/password
 * - POST /api/auth/register - Creates new user account
 * - Response includes JWT access token stored in localStorage
 * - Token automatically attached to all API requests via apiClient
 *
 * Usage:
 * const { user, token, login, logout, isAuthenticated } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

/**
 * User type matching backend User model
 * Fields: id, name, email
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Auth context value type
 * Includes state (user, token, loading) and methods (login, register, logout)
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * Wraps the application and provides authentication context to all child components
 *
 * Features:
 * - Loads token from localStorage on mount
 * - Automatically restores user session if token exists
 * - Provides login, register, and logout methods
 * - Manages loading and error states
 *
 * @param children React components to wrap with auth context
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // State variables
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount (session persistence)
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  /**
   * Login Method
   *
   * Sends email and password to backend for authentication
   * Backend: POST /api/auth/login
   * Request: { email: string; password: string }
   * Response: { user: User; accessToken: string }
   *
   * Stores token and user in localStorage and context state
   *
   * @param email - User email address
   * @param password - User password
   * @throws Error if authentication fails
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call backend authentication API
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { user: newUser, accessToken } = response.data;

      // Update state
      setUser(newUser);
      setToken(accessToken);

      // Persist to localStorage
      localStorage.setItem("auth_token", accessToken);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Login failed"
        : "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register Method
   *
   * Creates new user account via backend API
   * Backend: POST /api/auth/register
   * Request: { name: string; email: string; password: string }
   * Response: { user: User; accessToken: string }
   *
   * Stores token and user in localStorage and context state
   *
   * @param name - User full name
   * @param email - User email address
   * @param password - User password
   * @throws Error if registration fails
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call backend registration API
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const { user: newUser, accessToken } = response.data;

      // Update state
      setUser(newUser);
      setToken(accessToken);

      // Persist to localStorage
      localStorage.setItem("auth_token", accessToken);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Registration failed"
        : "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout Method
   *
   * Clears user session by removing token and user from state and localStorage
   * Optional: Could call DELETE /api/auth/logout to invalidate token on backend
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  // Provide context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 *
 * Use this hook in any component to access authentication state and methods
 * Must be used within an AuthProvider
 *
 * @returns AuthContextType with user, token, auth methods
 * @throws Error if used outside AuthProvider
 *
 * Example:
 * const { user, login, logout } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
