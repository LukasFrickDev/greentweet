// src/components/PostCard/index.tsx
import { Link } from 'react-router-dom'
import * as S from './styles'
import type { Post } from '../../types/Post'
import defaultAvatar from '../../assets/Logo.png'

interface Props {
  post: Post
  onToggleLike: (post: Post) => void
  onComment: (post: Post) => void
  canDelete?: boolean
  onDelete?: (post: Post) => void
}

const PostCard = ({ post, onToggleLike, onComment, canDelete = false, onDelete }: Props) => {
  return (
    <S.Card>
      <S.Avatar
        src={post.author_avatar || defaultAvatar}
        alt={post.author_username}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = defaultAvatar
        }}
      />
      <S.Body>
        <header>
          <Link to={`/profile/${post.author_username}`} className="author">
            @{post.author_username}
          </Link>
          <span className="date">
            {new Date(post.created_at).toLocaleString()}
          </span>
        </header>
        {post.content && <p>{post.content}</p>}
        {post.image && (
          <S.ImageWrapper>
            <S.Image src={post.image} alt="Imagem do post" loading="lazy" />
          </S.ImageWrapper>
        )}

        <footer>
          <div className="actions">
            <button
              type="button"
              className={post.is_liked ? 'liked' : ''}
              onClick={() => {
                onToggleLike(post)
              }}
            >
              {post.is_liked ? '💔 Descurtir' : '💚 Curtir'} ({post.likes_count ?? 0})
            </button>

            <button type="button" onClick={() => onComment(post)}>
              {`${canDelete ? '💬 Ver comentários' : '💬 Comentar'} (${post.comments_count ?? 0})`}
            </button>
          </div>

          {canDelete && (
            <button type="button" className="delete" onClick={() => onDelete?.(post)}>
              🗑️ Apagar
            </button>
          )}
        </footer>
      </S.Body>
    </S.Card>
  )
}

export default PostCard