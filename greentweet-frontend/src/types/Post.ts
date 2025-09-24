export interface Post {
  id: number
  authorId: number        // apenas o id do autor
  content: string
  image?: string
  created_at: string
  likes: number[]         // lista de userIds que curtiram
}

