import type { Post } from './Post'
import type { Profile } from './Profile'

export type SearchResponse = {
  users: Profile[]
  posts: Post[]
}
