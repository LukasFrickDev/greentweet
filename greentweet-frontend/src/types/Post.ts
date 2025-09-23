export interface Post {
  id: number
  author: {
    id: number
    username: string
    avatar_url?: string
  }
  content: string
  image?: string
  created_at: string
  likes_count: number
}
