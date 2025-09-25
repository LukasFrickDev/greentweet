export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = {
  username: string
  email: string
  password: string
}

// resposta do login
export type LoginResponse = {
  access: string
  refresh: string
}

// resposta do /auth/me/
export type AuthUser = {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  date_joined: string
}



