import api from "./axios"
import type { Follow, CreateFollowPayload } from "../types/Follow"

export const followsApi = {
  follow: (payload: CreateFollowPayload) => api.post<Follow>("/follows/", payload),

  unfollow: (id: number) => api.delete<void>(`/follows/${id}/`),

  listFollowers: (id: number) => api.get<Follow[]>(`/profiles/${id}/followers/`),
  
  listFollowing: (id: number) => api.get<Follow[]>(`/profiles/${id}/following/`),
}