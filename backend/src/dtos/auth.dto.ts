export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
}
