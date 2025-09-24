import * as S from './styles'
import { Link } from 'react-router-dom'
import PostCard from '../PostCard'
import type { Post } from '../../types'
import type { Comment } from '../../context/PostsContext'
import type { User } from '../../types'

type Props = {
  post: Post
  comments: Comment[]
  users: User[] // 👈 novo
  showAllComments: boolean
  onToggleLike: () => void
  onComment: (post: Post) => void
  onAddComment: (content: string) => void
  onToggleShowComments: () => void
  onClose: () => void
  newComment: string
  setNewComment: (value: string) => void
  isCommenting?: boolean
}

const PostHighlight = ({
  post,
  comments,
  users,
  showAllComments,
  onToggleLike,
  onComment,
  onAddComment,
  onToggleShowComments,
  onClose,
  newComment,
  setNewComment,
  isCommenting = false,
}: Props) => {
  const commentsToShow = showAllComments ? comments : comments.slice(0, 3)

  const renderComment = (c: Comment) => {
    const u = users.find((u) => u.id === c.userId)
    return (
      <li key={c.id}>
        <Link to={`/profile/${u?.id}`} className="author">
          @{u?.username || 'desconhecido'}
        </Link>
        : {c.content}
      </li>
    )
  }

  return (
    <S.HighlightedPost>
      <h3>Post em destaque</h3>
      <PostCard
        post={post}
        onToggleLike={onToggleLike}
        onComment={onComment}
      />

      <S.CommentsSection>
        <h4>Comentários</h4>
        <ul>{commentsToShow.map(renderComment)}</ul>

        {comments.length > 3 && (
          <S.SeeMoreButton onClick={onToggleShowComments}>
            {showAllComments ? 'Ver menos' : 'Ver mais'}
          </S.SeeMoreButton>
        )}

        <S.CommentInputWrapper>
          <S.CommentInput
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <S.CommentButton
            onClick={() => onAddComment(newComment)}
            disabled={isCommenting}
          >
            {isCommenting ? 'Comentando...' : 'Comentar'}
          </S.CommentButton>
        </S.CommentInputWrapper>
      </S.CommentsSection>

      <S.CloseButton onClick={onClose}>Fechar</S.CloseButton>
    </S.HighlightedPost>
  )
}

export default PostHighlight