import type { Notification } from '../types/Notification'

export const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    postId: 1,
    userId: 2,
    toUserId: 1,
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'follow',
    userId: 2,
    toUserId: 1,
    is_read: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    type: 'like',
    postId: 2,
    userId: 3,
    toUserId: 1,
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    type: 'follow',
    userId: 3,
    toUserId: 1,
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    type: 'comment',
    postId: 3,
    userId: 2,
    toUserId: 1,
    is_read: false,
    created_at: new Date().toISOString(),
  },    
  {
    id: 6,
    type: 'comment',
    postId: 3,
    userId: 2,
    toUserId: 1,
    is_read: false,
    created_at: new Date().toISOString(),
  },
]


