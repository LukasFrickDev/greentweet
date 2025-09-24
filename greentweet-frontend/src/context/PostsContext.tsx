import { createContext, useContext, useMemo, useState } from 'react'
import type { Post } from '../types'
import type { Notification, NotificationType } from '../types/Notification'
import { LOGGED_USER_ID } from '../mocks/session'
import { mockPosts } from '../mocks/posts'
import { mockComments } from '../mocks/comments'
import { mockNotifications } from '../mocks/notifications'
import type { Toast } from '../types/Toast'

export type Comment = {
  id: number
  postId: number
  userId: number
  content: string
  created_at?: string
}

type PostsContextValue = {
  posts: Post[]
  comments: Comment[]
  notifications: Notification[]
  selectedPost: Post | null

  toggleLike: (postId: number) => void
  addPost: (content: string) => void
  addComment: (postId: number, content: string) => void
  setSelectedPost: (post: Post | null) => void
  markNotificationRead: (notifId: number) => void
  createNotification: (payload: {
    type: NotificationType
    postId?: number
    userId: number
    toUserId: number
  }) => void

  getCommentsForPost: (postId: number) => Comment[]
  getNotificationsForLoggedUser: () => Notification[]

  // Toasts
  toasts: Toast[]
  showToast: (message: string) => void
  removeToast: (id: string) => void
}

const PostsContext = createContext<PostsContextValue | null>(null)

export const PostsProvider = ({ children }: { children: React.ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // --- Toasts ---
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message }])
    setTimeout(() => removeToast(id), 2500)
  }

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  // --- Notifications ---
  const createNotification: PostsContextValue['createNotification'] = ({
    type,
    postId,
    userId,
    toUserId,
  }) => {
    if (userId === toUserId) return
    const newNotif: Notification = {
      id: Date.now(),
      type,
      postId,
      userId,
      toUserId,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  // --- Posts ---
  const addPost: PostsContextValue['addPost'] = (content) => {
    if (!content.trim()) return
    const newPost: Post = {
      id: posts.length + 1,
      authorId: LOGGED_USER_ID,
      content,
      created_at: new Date().toISOString(),
      likes: [],
    }
    setPosts((prev) => [newPost, ...prev])
    showToast('Post publicado ✅')
  }

  // --- Likes ---
  const toggleLike: PostsContextValue['toggleLike'] = (postId) => {
    setPosts((prev) => {
      const before = prev.find((p) => p.id === postId)
      if (!before) return prev

      const wasLiked = before.likes.includes(LOGGED_USER_ID)
      const updatedLikes = wasLiked
        ? before.likes.filter((uid) => uid !== LOGGED_USER_ID)
        : [...before.likes, LOGGED_USER_ID]

      const after = { ...before, likes: updatedLikes }
      const next = prev.map((p) => (p.id === postId ? after : p))

      if (!wasLiked && after.authorId !== LOGGED_USER_ID) {
        setNotifications((prevNotifs) => {
          const alreadyNotified = prevNotifs.some(
            (n) =>
              n.type === 'like' &&
              n.postId === after.id &&
              n.userId === LOGGED_USER_ID
          )

          if (!alreadyNotified) {
            const newNotif: Notification = {
              id: Date.now(),
              type: 'like',
              postId: after.id,
              userId: LOGGED_USER_ID,
              toUserId: after.authorId,
              is_read: false,
              created_at: new Date().toISOString(),
            }
            showToast('Você curtiu um post 💚')
            return [newNotif, ...prevNotifs]
          }
          return prevNotifs
        })
      }

      if (!wasLiked && after.authorId === LOGGED_USER_ID) {
        showToast('Você curtiu seu próprio post 💚')
      }

      if (wasLiked) {
        showToast('Você removeu sua curtida ❌')
      }

      setSelectedPost((sp) => (sp?.id === postId ? after : sp))
      return next
    })
  }

  // --- Comments ---
  const addComment: PostsContextValue['addComment'] = (postId, content) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return
    const newC: Comment = {
      id: comments.length + 1,
      postId,
      userId: LOGGED_USER_ID,
      content,
      created_at: new Date().toISOString(),
    }
    setComments((prev) => [...prev, newC])

    createNotification({
      type: 'comment',
      postId,
      userId: LOGGED_USER_ID,
      toUserId: post.authorId,
    })

    showToast('Comentário publicado 💬')
  }

  // --- Notifications helpers ---
  const markNotificationRead: PostsContextValue['markNotificationRead'] = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    )
  }

  const getCommentsForPost: PostsContextValue['getCommentsForPost'] = (postId) =>
    comments.filter((c) => c.postId === postId)

  const getNotificationsForLoggedUser: PostsContextValue['getNotificationsForLoggedUser'] = () =>
    notifications.filter((n) => n.toUserId === LOGGED_USER_ID)

  const value = useMemo(
    () => ({
      posts,
      comments,
      notifications,
      selectedPost,
      toggleLike,
      addPost,
      addComment,
      setSelectedPost,
      markNotificationRead,
      createNotification,
      getCommentsForPost,
      getNotificationsForLoggedUser,
      toasts,
      showToast,
      removeToast,
    }),
    [posts, comments, notifications, selectedPost, toasts]
  )

  return (
    <PostsContext.Provider value={value}>
      {children}

      {/* Renderização dos toasts */}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#2e7d32',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: 6,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              fontFamily: 'sans-serif',
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </PostsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePosts = () => {
  const ctx = useContext(PostsContext)
  if (!ctx) throw new Error('usePosts must be used within PostsProvider')
  return ctx
}