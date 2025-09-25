// src/components/PostHighlight/index.tsx
import * as S from './styles'
import type { Post } from '../../types/Post'
import type { Comment } from '../../types/Comments'
import defaultAvatar from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { SeeMoreButton } from '../../pages/Feed/styles'

interface Props {
  post: Post
  comments: Comment[]
  showAllComments: boolean
  onToggleLike: (post: Post) => void
  onComment: (post: Post) => void
  onAddComment: (content: string) => void
  onToggleShowComments: () => void
  onClose: () => void
  canDelete?: boolean
  onDelete?: (post: Post) => void
  newComment: string
  setNewComment: (val: string) => void
  isCommenting: boolean
}

const PostHighlight = ({
  post,
  comments,
  showAllComments,
  onToggleLike,
  onAddComment,
  onToggleShowComments,
  onClose,
  canDelete = false,
  onDelete,
  newComment,
  setNewComment,
  isCommenting,
}: Props) => {
  return (
    <S.Highlight>
      <S.CloseButton onClick={onClose}>✖</S.CloseButton>
      <S.ContentPost> 
        <S.Header>
          <img
            src={post.author_avatar || defaultAvatar}
            alt={post.author_username}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultAvatar
            }}
          />
          <div>
            <Link to={`/profile/${post.author_username}`} className="author">
              @{post.author_username}
            </Link>
            <span>{new Date(post.created_at).toLocaleString()}</span>
          </div>
        </S.Header>

        <S.Content>
          {post.content && <p>{post.content}</p>}
          {post.image && <S.Image src={post.image} alt="post" />}
        </S.Content>

        <S.Footer>
          <button type="button" onClick={() => onToggleLike(post)}>
            {post.is_liked ? '💔 Descurtir' : '💚 Curtir'} ({post.likes_count ?? 0})
          </button>

          {canDelete && (
            <button type="button" className="delete" onClick={() => onDelete?.(post)}>
              🗑️ Apagar post
            </button>
          )}
        </S.Footer>
      </S.ContentPost>


      <S.Comments>
        <h4>Comentários</h4>
        {(showAllComments ? comments : comments.slice(0, 3)).map((c) => (
          <div key={c.id} className="comment">
            <img
              src={defaultAvatar}
              alt={c.user_username}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = defaultAvatar
              }}
            />
            <div>
          <Link to={`/profile/${c.user_username}`} className="author">
            @{c.user_username}
          </Link>
              <p>{c.content}</p>
              <span>{new Date(c.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {comments.length > 3 && (
          <SeeMoreButton onClick={onToggleShowComments}>
            {showAllComments ? 'Ver menos' : 'Ver mais'}
          </SeeMoreButton>
        )}
      </S.Comments>

      <S.NewComment>
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={() => onAddComment(newComment)} disabled={isCommenting}>
          {isCommenting ? 'Comentando...' : 'Comentar'}
        </button>
      </S.NewComment>
    </S.Highlight>
  )
}

export default PostHighlight