// src/api/auth.ts
import api from "./axios"
import type { LoginPayload, LoginResponse, RegisterPayload, AuthUser } from "../types/Auth"

export const authApi = {
  login: (payload: LoginPayload) => api.post<LoginResponse>("/auth/login/", payload),

  register: (payload: RegisterPayload) => api.post("/auth/register/", payload),

  me: () => api.get<AuthUser>("/auth/me/"),

  refresh: (refresh: string) => api.post<{ access: string }>("/auth/refresh/", { refresh }),
  
  logout: () => api.post("/auth/logout/"),
}