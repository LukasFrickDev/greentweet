// src/api/profiles.ts
import api from "./axios";
import type { Profile } from "../types/Profile";

export const profilesApi = {
  list: () => api.get<Profile[]>("/profile/"),
  detail: (id: number) => api.get<Profile>(`/profile/${id}/`),
  update: (id: number, data: Partial<Profile>) =>
    api.patch<Profile>(`/profile/${id}/`, data),
};