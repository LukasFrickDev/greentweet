import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { postsApi } from "../../api/posts"
import { commentsApi } from "../../api/comments"
import { notificationsApi } from "../../api/notifications"
import { usersApi } from "../../api/users"
import { likesApi } from "../../api/likes"
import type { Post, CreatePostPayload } from "../../types/Post"
import type { Comment } from "../../types/Comments"
import type { Notification } from "../../types/Notification"
import type { Profile } from "../../types/Profile"

type State = {
  posts: Post[]
  comments: Comment[]
  notifications: Notification[]
  profile: Profile | null
  selectedPost: Post | null
  loading: boolean
  error: string | null
}

const initialState: State = {
  posts: [],
  comments: [],
  notifications: [],
  profile: null,
  selectedPost: null,
  loading: false,
  error: null,
}

// --- Thunks ---
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await postsApi.list()
  return data
})

export const fetchPostsByUser = createAsyncThunk(
  "posts/fetchPostsByUser",
  async (username: string) => {
    const { data } = await postsApi.listByUser(username)
    return data
  }
)

export const fetchProfile = createAsyncThunk("posts/fetchProfile", async () => {
  const { data } = await usersApi.me()
  return data
})

export const fetchNotifications = createAsyncThunk("posts/fetchNotifications", async () => {
  const { data } = await notificationsApi.list()
  return data
})

export const markNotificationAsRead = createAsyncThunk(
  "posts/markNotificationAsRead", 
  async (id: number) => {
    await notificationsApi.markAsRead(id)
    return id
  }
)

export const addPost = createAsyncThunk("posts/addPost", async ({ content, image }: CreatePostPayload) => {
  const { data } = await postsApi.create({ content, image })
  return data
})

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, content }: { postId: number; content: string }) => {
    const { data } = await commentsApi.create({ post: postId, content })
    return data
  }
)

export const deletePost = createAsyncThunk("posts/deletePost", async (postId: number) => {
  await postsApi.remove(postId)
  return postId
})

// 🔥 Novo thunk para buscar comentários antigos
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId: number) => {
    const { data } = await commentsApi.list(postId) // GET /posts/:id/comments/
    return { postId, comments: data }
  }
)

export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ post, userId }: { post: Post; userId: number }) => {
    if (post.is_liked && post.current_user_like_id) {
      await likesApi.unlike(post.current_user_like_id)
    } else {
      await likesApi.like({ user: userId, post: post.id })
    }
    const { data } = await postsApi.detail(post.id)
    return data
  }
)

// --- Slice ---
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setSelectedPost(state, action) {
      state.selectedPost = action.payload
    },
    markNotificationRead(state, action) {
      const id = action.payload
      state.notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      )
    },
    // 🔥 Novo: resetar tudo no logout
    resetPosts(state) {
      state.posts = []
      state.comments = []
      state.notifications = []
      state.profile = null
      state.selectedPost = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload
      })
      .addCase(fetchPostsByUser.fulfilled, (state, action) => {
        const posts = action.payload
        const authorIds = new Set(posts.map((p) => p.author))

        const others = state.posts.filter((p) => !authorIds.has(p.author))
        state.posts = [...others, ...posts].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload)
        const postId = action.payload.post

        state.posts = state.posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments_count: (post.comments_count ?? 0) + 1,
              }
            : post
        )

        if (state.selectedPost && state.selectedPost.id === postId) {
          state.selectedPost = {
            ...state.selectedPost,
            comments_count: (state.selectedPost.comments_count ?? 0) + 1,
          }
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload
        // substitui os comentários daquele post
        state.comments = [
          ...state.comments.filter((c) => c.post !== postId),
          ...comments,
        ]
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const updated = action.payload
        state.posts = state.posts.map((p) => (p.id === updated.id ? updated : p))
        if (state.selectedPost && state.selectedPost.id === updated.id) {
          state.selectedPost = updated
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        const postId = action.payload
        state.posts = state.posts.filter((post) => post.id !== postId)
        state.comments = state.comments.filter((comment) => comment.post !== postId)
        if (state.selectedPost && state.selectedPost.id === postId) {
          state.selectedPost = null
        }
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload
        state.notifications = state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      })
  },
})

export const { setSelectedPost, resetPosts } = postsSlice.actions
export default postsSlice.reducer