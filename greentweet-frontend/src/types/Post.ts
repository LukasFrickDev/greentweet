export type Post = {
  id: number
  author: number
  author_username: string
  content: string
  image: string | null
  created_at: string
  tags: number[] // pelo retorno, são IDs
  likes_count: number
  comments_count: number
  is_liked: boolean
  current_user_like_id: number | null
  author_avatar?: string | null
}



// payloads
export type CreatePostPayload = {
  content: string
  image?: File
}

export type UpdatePostPayload = {
  content?: string
  image?: File | null
}
