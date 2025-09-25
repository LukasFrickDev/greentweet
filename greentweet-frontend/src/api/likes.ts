import api from "./axios"
import type { Like, CreateLikePayload } from "../types/Like"

export const likesApi = {
  like: (payload: CreateLikePayload) => api.post<Like>("/likes/", payload),
  
  unlike: (id: number) => api.delete<void>(`/likes/${id}/`),
}