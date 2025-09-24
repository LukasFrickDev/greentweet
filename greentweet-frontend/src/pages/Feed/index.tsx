import * as S from './styles'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PostCard from '../../components/PostCard'
import PostHighlight from '../../components/PostHighlight'
import defaultAvatar from '../../assets/logo.png'
import { mockUsers } from '../../mocks/users'
import { usePosts } from '../../context/PostsContext'
import type { Post } from '../../types'
import type { Notification } from '../../types/Notification'

const Feed = () => {
  const {
    posts,
    selectedPost,
    setSelectedPost,
    toggleLike,
    addPost,
    addComment,
    getCommentsForPost,
    getNotificationsForLoggedUser,
  } = usePosts()

  const [newPost, setNewPost] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const navigate = useNavigate()

  const handlePostSubmit = async () => {
    if (!newPost.trim()) return
    setIsPosting(true)

    // Delay de 1.5 segundos para mostrar "Publicando..."
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      addPost(newPost)
      setNewPost('')
    } finally {
      setIsPosting(false)
    }
  }

  const handleAddComment = async (content: string) => {
    if (!content.trim() || !selectedPost) return
    setIsCommenting(true)
    
    // Delay de 2 segundos para mostrar "Comentando..."
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      addComment(selectedPost.id, content)
      setNewComment('')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleNotificationClick = (n: Notification) => {
    if (n.type === 'like' && n.postId) {
      const post = posts.find((p) => p.id === n.postId)
      if (post) {
        setSelectedPost(post)
        setShowAllComments(false)
      }
    }
    if (n.type === 'follow' && n.userId) {
      navigate(`/profile/${n.userId}`)
    }
  }

  const handleCommentClick = (post: Post) => {
    setSelectedPost(post)
    setShowAllComments(false)
  }

  const commentsForPost = selectedPost ? getCommentsForPost(selectedPost.id) : []

  return (
    <S.Container>
      <S.Header>
        <h1>GreenTweet</h1>
      </S.Header>

      <S.Content>
        <S.Main>
          <S.NewTweetWrapper>
            <S.TweetInput
              placeholder="No que você está pensando?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
            />
            <S.TweetButton onClick={handlePostSubmit} disabled={isPosting}>
              {isPosting ? 'Publicando...' : 'Publicar'}
            </S.TweetButton>
          </S.NewTweetWrapper>

          {selectedPost && (
            <PostHighlight
              post={selectedPost}
              comments={commentsForPost}
              users={mockUsers} 
              showAllComments={showAllComments}
              onToggleLike={() => toggleLike(selectedPost.id)}
              onComment={handleCommentClick}
              onAddComment={handleAddComment}
              onToggleShowComments={() => setShowAllComments((prev) => !prev)}
              onClose={() => setSelectedPost(null)}
              newComment={newComment}
              setNewComment={setNewComment}
              isCommenting={isCommenting}
            />
          )}

          <S.TweetsWrapper>
            {posts
              .filter((p) => !selectedPost || p.id !== selectedPost.id)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onToggleLike={() => toggleLike(post.id)}
                  onComment={handleCommentClick}
                />
              ))}
          </S.TweetsWrapper>
        </S.Main>

        <S.Aside>
          <S.ProfileCard>
            <img
              src={mockUsers[0].avatar_url || defaultAvatar}
              alt={mockUsers[0].username}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = defaultAvatar
              }}
            />
            <h2>@{mockUsers[0].username}</h2>
            <p>{mockUsers[0].bio}</p>
            <S.FollowInfo>
              <span><strong>{mockUsers[0].following}</strong> Seguindo</span>
              <span><strong>{mockUsers[0].followers}</strong> Seguidores</span>
            </S.FollowInfo>
          </S.ProfileCard>

          <S.Notifications>
            <h3>Notificações</h3>
            <ul>
              {getNotificationsForLoggedUser()
                .slice(0, showAll ? undefined : 5)
                .map((n) => (
                  <li
                    key={n.id}
                    className={n.is_read ? 'read' : 'unread'}
                    onClick={() => handleNotificationClick(n)}
                  >
                    {(() => {
                      const user = mockUsers.find((u) => u.id === n.userId)
                      const username = user?.username || 'alguém'

                      if (n.type === 'like') return `${username} curtiu seu post 💚`
                      if (n.type === 'comment') return `${username} comentou no seu post 💬`
                      if (n.type === 'follow') return `${username} começou a seguir você 👤`
                      return 'Notificação'
                    })()}
                  </li>
                ))}
            </ul>
            {getNotificationsForLoggedUser().length > 5 && (
              <S.SeeMoreButton onClick={() => setShowAll((prev) => !prev)}>
                {showAll ? 'Ver menos' : 'Ver mais'}
              </S.SeeMoreButton>
            )}
          </S.Notifications>
        </S.Aside>
      </S.Content>
    </S.Container>
  )
}

export default Feed