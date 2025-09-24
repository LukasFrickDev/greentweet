import type { Post } from '../types'

export const mockPosts: Post[] = [
  {
    id: 1,
    authorId: 1, // lukas
    content: 'Primeiro post no GreenTweet 🌱',
    created_at: new Date().toISOString(),
    likes: [2, 3], // Ana e Carlos curtiram
  },
  {
    id: 2,
    authorId: 2, // ana
    content: 'Curtindo a vibe sustentável 💚',
    created_at: new Date().toISOString(),
    likes: [1, 3], // Lukas e Carlos curtiram
  },
  {
    id: 3,
    authorId: 3, // carlos
    content: 'Explorando novas ideias para um mundo melhor 🌍',
    created_at: new Date().toISOString(),
    likes: [1], // Lukas curtiu
  },
]

