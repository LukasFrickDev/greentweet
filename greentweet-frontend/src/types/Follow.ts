import type { Profile } from './Profile'

export interface Follow {
  id: number
  follower: number
  following: number
  created_at: string
  follower_profile?: Profile | null
  following_profile?: Profile | null
  follower_username?: string | null
  following_username?: string | null
}

export type CreateFollowPayload = {
  follower: number
  following: number
}
