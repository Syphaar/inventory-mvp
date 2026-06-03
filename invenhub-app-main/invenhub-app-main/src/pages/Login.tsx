/**
 * Login Page
 *
 * Public page for user authentication.
 * Allows users to sign in with email and password.
 *
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Loading state during authentication
 * - Link to register page for new users
 * - Responsive layout (full sidebar on desktop, hidden on mobile)
 *
 * Backend Integration:
 * - POST /api/auth/login - Sends credentials to backend
 * - Response includes JWT token and user info
 * - Token stored in localStorage automatically by AuthContext
 *
 * Redirects to /dashboard on successful login via ProtectedRoute
 * Unauthenticated users remain on /login
 *
 * Usage:
 * <Route path="/login" element={<Login />} />
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Boxes } from "lucide-react";

/**
 * Login Page Component
 *
 * Renders authentication form with email/password inputs.
 * On successful login, redirects to dashboard via ProtectedRoute.
 */
export default function Login() {
  // Navigation
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Form state
  const [email, setEmail] = useState("demo@inventory.app");
  const [password, setPassword] = useState("demo1234");
  const [isLoading, setIsLoading] = useState(false);

  // Get login function from context
  const { login } = useAuth();

  /**
   * Handle Form Submission
   *
   * Validates inputs and calls login API
   * Shows success/error toast notifications
   * Redirects to dashboard on success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }

      // Call login API via AuthContext
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Desktop Only: Brand/Marketing Section */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-sidebar text-sidebar-foreground">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">
            IM
          </div>
          <span className="font-semibold">Inventory MVP</span>
        </div>

        {/* Hero Message */}
        <div>
          <Boxes className="h-12 w-12 mb-6 text-sidebar-primary" />
          <h2 className="text-3xl font-semibold leading-tight">Run your inventory like a pro.</h2>
          <p className="mt-3 text-sm opacity-70 max-w-md">
            Track products, stock, sales and purchases in one elegant dashboard.
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs opacity-50">© 2026 Inventory MVP</div>
      </div>

      {/* Login Form Section */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="your@email.com"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          {/* Register Link */}
          <p className="text-sm text-muted-foreground text-center">
            No account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
