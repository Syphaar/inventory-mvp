/**
 * Register Page
 *
 * Public page for user registration.
 * Allows new users to create an account with name, email, and password.
 *
 * Features:
 * - Name input field
 * - Email input field
 * - Password input field (minimum 6 characters)
 * - Form validation
 * - Link to login page for existing users
 * - Card-based centered layout
 *
 * Backend Integration:
 * - POST /api/auth/register - Sends registration data to backend
 * - Backend validates unique email and creates user account
 * - Response includes JWT token and user info
 * - Token stored in localStorage automatically by AuthContext
 *
 * Redirects to /dashboard on successful registration via ProtectedRoute
 *
 * Usage:
 * <Route path="/register" element={<Register />} />
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

/**
 * Register Page Component
 *
 * Renders registration form with name, email, and password inputs.
 * On successful registration, redirects to dashboard via ProtectedRoute.
 */
export default function Register() {
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get register function from context
  const { register } = useAuth();

  /**
   * Handle Form Submission
   *
   * Validates inputs:
   * - All fields required
   * - Password minimum 6 characters
   * - Password and confirm password match
   *
   * Calls register API and redirects on success
   * Shows error toast on failure
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate inputs
      if (!name || !email || !password || !confirmPassword) {
        toast.error("All fields are required");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      // Call register API via AuthContext
      await register(name, email, password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm bg-card border rounded-xl p-8 shadow-sm">
        {/* Logo */}
        <div className="h-10 w-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold mb-6">
          IM
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Start managing inventory in seconds.</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="John Doe"
            />
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-muted-foreground text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
