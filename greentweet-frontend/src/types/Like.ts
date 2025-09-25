export interface Like {
  id: number
  user: number
  post: number
  created_at: string
}

export type CreateLikePayload = {
  user: number
  post: number
}
