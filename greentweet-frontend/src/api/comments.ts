// src/api/comments.ts
import api from "./axios"
import type { Comment, CreateCommentPayload } from "../types/Comments"

export const commentsApi = {
  list: (postId: number) => api.get<Comment[]>(`/comments/?post=${postId}`),
  
  create: (payload: CreateCommentPayload) =>
    api.post<Comment>("/comments/", {
      post: payload.post,
      content: payload.content,
    }),

  remove: (id: number) => api.delete<void>(`/comments/${id}/`),
}