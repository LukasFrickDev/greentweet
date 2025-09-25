import api from "./axios"
import type { Tag } from "../types/Tag"
import type { Post } from "../types/Post"

export const tagsApi = {
  list: () => api.get<Tag[]>("/tags/"),

  detail: (name: string) => api.get<Tag>(`/tags/${name}/`),
  
  posts: (name: string) => api.get<Post[]>(`/tags/${name}/posts/`),
}