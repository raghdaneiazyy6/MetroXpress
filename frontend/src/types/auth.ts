// src/types/auth.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "staff";
  profilePicture?: string;
  phone?: string;
  location?: string;
  bio?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
