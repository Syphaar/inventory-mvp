export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
