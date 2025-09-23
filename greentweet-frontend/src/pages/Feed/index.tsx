// pages/Feed/index.tsx
import * as S from './styles'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/authSlice'
import api from '../../api/axios'
import type { Post } from '../../types/Post'
import PostCard from '../../components/PostCard'

const Feed = () => {
  const dispatch = useAppDispatch()
  const access = useAppSelector((state) => state.auth.access)
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    if (!access) {
      dispatch(logout())
      return
    }
    try {
      const res = await api.get<Post[]>('/posts/')
      setPosts(res.data)
    } catch (err) {
      console.error('Erro ao buscar posts:', err)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [access])

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return
    setLoading(true)
    try {
      const res = await api.post<Post>('/posts/', { content: newPost })
      setPosts((prev) => [res.data, ...prev])
      setNewPost('')
    } catch (err) {
      console.error('Erro ao criar post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id: number) => {
    try {
      await api.post('/likes/', { post: id })
      setPosts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, likes_count: p.likes_count + 1 } : p
        )
      )
    } catch (err) {
      console.error('Erro ao curtir:', err)
    }
  }

  return (
    <S.Container>
      <S.Header>
        <h1>GreenTweet</h1>
        <button onClick={() => dispatch(logout())}>Logout</button>
      </S.Header>

      <S.NewTweetWrapper>
        <S.TweetInput
          placeholder="No que você está pensando?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <S.TweetButton disabled={loading} onClick={handlePostSubmit}>
          {loading ? 'Publicando...' : 'Publicar'}
        </S.TweetButton>
      </S.NewTweetWrapper>

      <S.TweetsWrapper>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onLike={handleLike} />
        ))}
      </S.TweetsWrapper>
    </S.Container>
  )
}

export default Feed