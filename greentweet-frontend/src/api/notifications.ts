import api from "./axios"
import type { Notification, CreateNotificationPayload } from "../types/Notification"

export const notificationsApi = {
  list: () => api.get<Notification[]>("/notifications/"),

  create: (payload: CreateNotificationPayload) =>
    api.post<Notification>("/notifications/", payload),
  
  markAsRead: (id: number) => api.patch(`/notifications/${id}/`, { is_read: true }),
}