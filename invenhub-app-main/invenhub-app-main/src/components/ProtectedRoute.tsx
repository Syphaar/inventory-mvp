/**
 * Protected Route Component
 *
 * Wraps routes that require authentication
 * Redirects unauthenticated users to the login page
 *
 * How it works:
 * 1. Checks if user is authenticated via useAuth() hook
 * 2. If authenticated, renders the protected content
 * 3. If not authenticated, redirects to /login
 * 4. While loading, shows a loading state
 *
 * Backend Integration:
 * - Relies on AuthContext to determine authentication status
 * - Token comes from POST /api/auth/login or /api/auth/register
 *
 * Usage:
 * <ProtectedRoute>
 *   <Dashboard />
 * </ProtectedRoute>
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 *
 * @param children - Components to render if authenticated
 * @returns Protected component or redirect to login
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render protected content
  return children;
}
