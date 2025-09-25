// src/api/users.ts
import api from "./axios"
import type { Profile, UpdateProfilePayload } from "../types/Profile"

export const usersApi = {
  me: () => api.get<Profile>("/profiles/me/"),

  detail: (username: string) => api.get<Profile>(`/profiles/username/${username}/`),

  update: (id: number, payload: UpdateProfilePayload) => {
    const { avatar, ...rest } = payload

    if (avatar instanceof File) {
      const formData = new FormData()

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string)
        }
      })

      formData.append('avatar', avatar)

      return api.patch<Profile>(`/profiles/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }

    const body: Record<string, unknown> = {}
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        body[key] = value
      }
    })

    if (avatar === null) {
      body.avatar = null
    }

    return api.patch<Profile>(`/profiles/${id}/`, body)
  },
}