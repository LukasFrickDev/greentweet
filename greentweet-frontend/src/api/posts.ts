import api from "./axios"
import type { Post, CreatePostPayload, UpdatePostPayload } from "../types/Post"

export const postsApi = {
  getById: (id: number) => api.get<Post>(`/posts/${id}/`),

  list: () => api.get<Post[]>("/posts/"),   // 👈 retorna array direto

  listByUser: (username: string) =>
    api.get<Post[]>(`/posts/`, { params: { author: username } }),

  detail: (id: number) => api.get<Post>(`/posts/${id}/`),

  create: ({ content, image }: CreatePostPayload) => {
    const fd = new FormData()
    fd.append("content", content)
    if (image) fd.append("image", image)
    return api.post<Post>("/posts/", fd)
  },

  update: (id: number, { content, image }: UpdatePostPayload) => {
    if (image instanceof File) {
      const fd = new FormData()
      if (content) fd.append("content", content)
      fd.append("image", image)
      return api.patch<Post>(`/posts/${id}/`, fd)
    }
    if (image === null) {
      return api.patch<Post>(`/posts/${id}/`, { image: null })
    }
    return api.patch<Post>(`/posts/${id}/`, { content })
  },

  remove: (id: number) => api.delete<void>(`/posts/${id}/`),
}