import React, { useState, useEffect } from "react";
import { AuthContext, User, AuthContextType } from "./auth-context";
import { authApi } from "@/api/auth.api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { user: newUser, accessToken } = await authApi.login(email, password);

    setUser(newUser);
    setToken(accessToken);

    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const register = async (name: string, email: string, password: string) => {
    const { user: newUser, accessToken } = await authApi.register(name, email, password);

    setUser(newUser);
    setToken(accessToken);

    localStorage.setItem("auth_token", accessToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

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
