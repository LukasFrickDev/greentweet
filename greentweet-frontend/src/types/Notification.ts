export type NotificationType = 'like' | 'follow' | 'comment'

export interface Notification {
  id: number
  type: NotificationType
  actor_username: string
  post?: number
  post_id?: number // Campo que vem do backend
  post_content?: string // Conteúdo do post (opcional)
  is_read: boolean
  created_at: string
}


// payload para criar notificação
export type CreateNotificationPayload = {
  type: NotificationType
  post?: number
  user: number       // quem gerou
  to_user: number    // quem recebe
}


