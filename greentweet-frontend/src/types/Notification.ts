// src/types/Notification.ts
export type NotificationType = 'like' | 'follow' | 'comment'

export interface Notification {
  id: number
  type: NotificationType
  postId?: number        // presente em 'like'
  userId: number         // quem realizou a ação (ex.: quem curtiu)
  toUserId: number       // quem deve receber (ex.: autor do post)
  is_read: boolean
  created_at?: string 
}