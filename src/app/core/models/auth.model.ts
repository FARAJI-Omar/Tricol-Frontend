export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  accessToken: string;
  refreshToken: string;
  username: string;
  role: string;
  permissions: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  id: number;
  accessToken: string | null;
  username: string;
  role: string | null;
  permissions: string[];
}
