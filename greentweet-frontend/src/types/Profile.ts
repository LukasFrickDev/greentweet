export interface Profile {
  id: number
  user_id: number
  username: string
  first_name: string
  last_name: string
  bio: string
  avatar: string | null
}

// payload para update de perfil
export type UpdateProfilePayload = {
  username?: string
  first_name?: string
  last_name?: string
  bio?: string
  avatar?: File | null
}


