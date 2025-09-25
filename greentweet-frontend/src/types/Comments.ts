// src/types/comment.ts

export interface Comment {
  id: number
  user: number
  user_username: string
  post: number
  content: string
  created_at: string
}


export type CreateCommentPayload = {
  post: number
  content: string
}
