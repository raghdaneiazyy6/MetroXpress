// src/types/auth.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "staff";
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
