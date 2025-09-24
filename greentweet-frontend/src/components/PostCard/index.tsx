// components/PostCard/index.tsx

import { Link } from 'react-router-dom'

import * as S from './styles'
import type { Post } from '../../types'
import { mockUsers } from '../../mocks/users'
import defaultAvatar from '../../assets/logo.png'
import { LOGGED_USER_ID } from '../../mocks/session'

interface Props {
  post: Post
  onToggleLike: (id: number) => void
  onComment: (post: Post) => void
}

const PostCard = ({ post, onToggleLike, onComment }: Props) => {
  const author = mockUsers.find((u) => u.id === post.authorId)
  const hasLiked = post.likes.includes(LOGGED_USER_ID)

  return (
    <S.Card>
      <S.Avatar
        src={author?.avatar_url || defaultAvatar}
        alt={author?.username}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = defaultAvatar
        }}
      />
      <S.Body>
        <header>
          <Link to={`/profile/${author?.id}`} className="author">
            @{author?.username || 'desconhecido'}
          </Link>

          <span className="date">{new Date(post.created_at).toLocaleString()}</span>
        </header>

        <p>{post.content}</p>
        {post.image && <S.Image src={post.image} alt="post" />}

        <footer>
          <button onClick={() => onToggleLike(post.id)}>
            {hasLiked ? '💔 Descurtir' : '💚 Curtir'} ({post.likes.length})
          </button>
          <button onClick={() => onComment(post)}>Comentar</button>
        </footer>
      </S.Body>
    </S.Card>
  )
}

export default PostCard