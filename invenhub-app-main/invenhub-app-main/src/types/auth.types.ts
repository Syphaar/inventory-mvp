/**
 * Authentication Types
 *
 * TypeScript interfaces matching backend User model (/backend/models/user.model.ts)
 *
 * Backend Model:
 * - User { id, name, email, password (hashed), createdAt, updatedAt }
 *
 * These types ensure frontend-backend type safety.
 * API responses must conform to these interfaces.
 */

/**
 * User - Represents authenticated user
 *
 * Fields:
 * - id: Unique user identifier (UUID or similar)
 * - name: User's full name
 * - email: User's email address (unique)
 *
 * Backend Route: GET /api/auth/me
 * Response: User object
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * LoginRequest - Request body for login endpoint
 *
 * Backend Route: POST /api/auth/login
 * Request body type
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * RegisterRequest - Request body for registration endpoint
 *
 * Backend Route: POST /api/auth/register
 * Request body type
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/**
 * AuthResponse - Response from login/register endpoints
 *
 * Backend Route: POST /api/auth/login or /api/auth/register
 * Response body type
 */
export interface AuthResponse {
  user: User;
  accessToken: string;
}
