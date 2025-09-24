import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import * as S from './styles'
import PostCard from '../../components/PostCard'
import PostHighlight from '../../components/PostHighlight'
import defaultAvatar from '../../assets/logo.png'
import { mockUsers } from '../../mocks/users'
import { LOGGED_USER_ID } from '../../mocks/session'
import { usePosts } from '../../context/PostsContext'
import type { Post } from '../../types'

const Profile = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const user = mockUsers.find((u) => u.id === Number(id))
  const [isFollowing, setIsFollowing] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || ''
  })

  const {
    posts,
    selectedPost,
    setSelectedPost,
    toggleLike,
    addComment,
    getCommentsForPost,
  } = usePosts()

  const [newComment, setNewComment] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  if (!user) {
    return (
      <S.Container>
        <S.BackButton onClick={() => navigate('/feed')}>← Voltar ao Feed</S.BackButton>
        <p>Usuário não encontrado</p>
      </S.Container>
    )
  }

  const isOwnProfile = user.id === LOGGED_USER_ID
  const userPosts: Post[] = posts.filter((p) => p.authorId === user.id)

  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    // Delay de 1,5 segundos para mostrar "Salvando..."
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      const idx = mockUsers.findIndex((u) => u.id === user.id)
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...editData }
      }
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddComment = async (content: string) => {
    if (!content.trim() || !selectedPost) return
    setIsCommenting(true)

    // Delay de 1.5 segundos para mostrar "Comentando..."
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      addComment(selectedPost.id, content)
      setNewComment('')
    } finally {
      setIsCommenting(false)
    }
  }

  const commentsForPost = selectedPost ? getCommentsForPost(selectedPost.id) : []

  return (
    <S.Container>
      <S.BackButton onClick={() => navigate('/feed')}>← Voltar ao Feed</S.BackButton>

      <S.ProfileHeader>
        <img
          src={editData.avatar_url || defaultAvatar}
          alt={editData.username}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultAvatar
          }}
        />

        {isOwnProfile && isEditing ? (
          <>
            <input
              value={editData.username}
              onChange={(e) => setEditData({ ...editData, username: e.target.value })}
            />
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            />
            <input
              value={editData.avatar_url}
              onChange={(e) => setEditData({ ...editData, avatar_url: e.target.value })}
              placeholder="URL do avatar"
            />
            <S.FollowButton onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar'}
            </S.FollowButton>
            <S.FollowButton onClick={() => setIsEditing(false)}>Cancelar</S.FollowButton>
          </>
        ) : (
          <>
            <h2>@{user.username}</h2>
            <p>{user.bio}</p>

            <S.FollowInfo>
              <span><strong>{user.following}</strong> Seguindo</span>
              <span><strong>{user.followers}</strong> Seguidores</span>
            </S.FollowInfo>

            {isOwnProfile ? (
              <S.FollowButton onClick={() => setIsEditing(true)}>Editar perfil</S.FollowButton>
            ) : (
              <S.FollowButton
                onClick={() => setIsFollowing((prev) => !prev)}
                className={isFollowing ? 'unfollow' : 'follow'}
              >
                {isFollowing ? 'Deixar de seguir' : 'Seguir'}
              </S.FollowButton>
            )}
          </>
        )}
      </S.ProfileHeader>

      <S.PostsSection>
        <h3>Posts</h3>

        {selectedPost && (
          <PostHighlight
            post={selectedPost}
            comments={commentsForPost}
            users={mockUsers}
            showAllComments={showAllComments}
            onToggleLike={() => toggleLike(selectedPost.id)}
            onComment={(p) => setSelectedPost(p)}
            onAddComment={handleAddComment}
            onToggleShowComments={() => setShowAllComments((prev) => !prev)}
            onClose={() => setSelectedPost(null)}
            newComment={newComment}
            setNewComment={setNewComment}
            isCommenting={isCommenting}
          />
        )}

        {userPosts.length > 0 ? (
          userPosts
            .filter((p) => !selectedPost || p.id !== selectedPost.id)
            .map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLike={() => toggleLike(post.id)}
                onComment={(p) => setSelectedPost(p)}
              />
            ))
        ) : (
          <p>Este usuário ainda não tem posts.</p>
        )}
      </S.PostsSection>
    </S.Container>
  )
}

export default Profile