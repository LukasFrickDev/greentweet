import * as S from './styles'
import type { Post } from '../../types/Post'

interface Props {
  post: Post
  onLike: (id: number) => void
}

const PostCard = ({ post, onLike }: Props) => {
  return (
    <S.Card>
      <S.Avatar src={post.author.avatar_url || '/default-avatar.png'} />
      <S.Body>
        <header>
          <span className="author">{post.author.username}</span>
          <span className="date">
            {new Date(post.created_at).toLocaleString()}
          </span>
        </header>
        <p>{post.content}</p>
        {post.image && <S.Image src={post.image} alt="post" />}
        <footer>
          <button onClick={() => onLike(post.id)}>
            Curtir ({post.likes_count})
          </button>
          <button>Comentar</button>
        </footer>
      </S.Body>
    </S.Card>
  )
}

export default PostCard