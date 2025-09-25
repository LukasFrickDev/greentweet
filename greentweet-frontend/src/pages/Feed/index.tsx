import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as S from './styles'

import type { ChangeEvent } from 'react'

import PostCard from '../../components/PostCard'
import PostHighlight from '../../components/PostHighlight'
import ConfirmModal from '../../components/ConfirmModal'
import defaultAvatar from '../../assets/Logo.png'
import { followsApi } from '../../api/follows'
import { tagsApi } from '../../api/tags'
import type { Post } from '../../types/Post'
import type { Notification } from '../../types/Notification'
import type { Tag } from '../../types/Tag'
import { logout } from '../../store/slices/authSlice'
import {
  fetchPosts,
  fetchProfile,
  fetchNotifications,
  addPost,
  addComment,
  setSelectedPost,
  markNotificationAsRead,
  fetchComments,
  resetPosts,
  deletePost,
} from '../../store/slices/postSlice'
import SearchBar from '../../components/SearchBar'
import { toggleLikeIfAuthenticated } from '../../utils/likes'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useToast } from '../../hooks/useToast'

const Feed = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const user = useAppSelector((state) => state.auth.user)
  const userId = user?.id ?? null
  const posts = useAppSelector((state) => state.posts.posts)
  const selectedPost = useAppSelector((state) => state.posts.selectedPost)
  const profile = useAppSelector((state) => state.posts.profile)
  const notifications = useAppSelector((state) => state.posts.notifications)
  const comments = useAppSelector((state) => state.posts.comments)

  const [newPost, setNewPost] = useState('')
  const [newPostImage, setNewPostImage] = useState<File | null>(null)
  const [newPostImagePreview, setNewPostImagePreview] = useState<string | null>(null)
  const [postImageError, setPostImageError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [topTags, setTopTags] = useState<Tag[]>([])
  const [isTagsLoading, setIsTagsLoading] = useState(false)
  const [tagsError, setTagsError] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [filterError, setFilterError] = useState<string | null>(null)
  const [postPendingDeletion, setPostPendingDeletion] = useState<Post | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'world' | 'following'>('world')
  const [visibleCount, setVisibleCount] = useState(5)
  const [followingIds, setFollowingIds] = useState<number[]>([])
  const [isFollowingLoading, setIsFollowingLoading] = useState(false)

  const newPostImageUrlRef = useRef<string | null>(null)
  const { showToast } = useToast()

  const postsLength = Array.isArray(posts) ? posts.length : 0
  const filteredPostsLength = filteredPosts.length

  const handleLogout = () => {
    dispatch(logout())
    dispatch(resetPosts())
    navigate('/')
  }

  useEffect(() => {
    return () => {
      const objectUrl = newPostImageUrlRef.current
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
      dispatch(setSelectedPost(null))
      setShowAllComments(false)
    }
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchProfile())
    dispatch(fetchNotifications())
  }, [dispatch])

  useEffect(() => {
    if (!user || !profile) return

    const loadFollows = async () => {
      setIsFollowingLoading(true)
      try {
        const { data: followers } = await followsApi.listFollowers(profile.id)
        const { data: following } = await followsApi.listFollowing(profile.id)
        setFollowersCount(followers.length)
        setFollowingCount(following.length)
        setFollowingIds(following.map((item) => item.following))
      } catch (error) {
        console.error('Erro ao carregar follows', error)
        setFollowingIds([])
      } finally {
        setIsFollowingLoading(false)
      }
    }

    void loadFollows()
  }, [user, profile])

  useEffect(() => {
    setVisibleCount(5)
  }, [activeTag, viewMode, postsLength, filteredPostsLength])

  const refreshTags = useCallback(async () => {
    setIsTagsLoading(true)
    setTagsError(null)
    try {
      const { data } = await tagsApi.list()
      const topFive = [...data]
        .sort((a, b) => (b.posts_count ?? 0) - (a.posts_count ?? 0))
        .slice(0, 5)
      setTopTags(topFive)
    } catch (error) {
      console.error('Erro ao carregar hashtags', error)
      setTopTags([])
      setTagsError('Não foi possível carregar hashtags agora.')
    } finally {
      setIsTagsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshTags()
  }, [refreshTags])

  const clearNewPostImage = () => {
    const objectUrl = newPostImageUrlRef.current
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      newPostImageUrlRef.current = null
    }
    setNewPostImage(null)
    setNewPostImagePreview(null)
  }

  const handleRemoveNewPostImage = () => {
    clearNewPostImage()
    setPostImageError(null)
  }

  const handleNewPostImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      clearNewPostImage()
      setPostImageError(null)
      event.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      setPostImageError('Envie apenas arquivos de imagem.')
      clearNewPostImage()
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setPostImageError('A imagem não pode ultrapassar 2MB.')
      clearNewPostImage()
      event.target.value = ''
      return
    }

    if (newPostImageUrlRef.current) {
      URL.revokeObjectURL(newPostImageUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    newPostImageUrlRef.current = objectUrl
    setNewPostImage(file)
    setNewPostImagePreview(objectUrl)
    setPostImageError(null)
    event.target.value = ''
  }

  const applyTagFilter = useCallback(async (tagName: string) => {
    setIsFiltering(true)
    setFilterError(null)
    try {
      const { data } = await tagsApi.posts(tagName)
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setFilteredPosts(sorted)
      if (sorted.length === 0) {
        setFilterError(`Nenhum post encontrado para #${tagName}`)
      }
    } catch (error) {
      console.error('Erro ao carregar posts por hashtag', error)
      setFilteredPosts([])
      setFilterError(`Não foi possível carregar posts para #${tagName}`)
    } finally {
      setIsFiltering(false)
    }
  }, [])

  const handlePostSubmit = async () => {
    if (!userId) return

    const trimmedContent = newPost.trim()
    if (!trimmedContent && !newPostImage) {
      setPostImageError('Escreva algo ou envie uma imagem para publicar.')
      return
    }

    setIsPosting(true)
    try {
      const payload = newPostImage
        ? { content: trimmedContent, image: newPostImage }
        : { content: trimmedContent }

      await dispatch(addPost(payload)).unwrap()
      setNewPost('')
      clearNewPostImage()
      setPostImageError(null)
      showToast('Post publicado com sucesso!')

      try {
        await dispatch(fetchPosts()).unwrap()
      } catch (error) {
        console.error('Erro ao atualizar feed após novo post', error)
      }
      await refreshTags()
      if (activeTag) {
        await applyTagFilter(activeTag)
      }
    } catch (error) {
      console.error('Erro ao publicar post', error)
      showToast('Não foi possível publicar o post. Tente novamente.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleAddComment = async (content: string) => {
    if (!content.trim() || !selectedPost || !userId) return

    setIsCommenting(true)
    try {
      await dispatch(addComment({ postId: selectedPost.id, content }))
      setNewComment('')
      showToast('Comentário publicado!')
    } catch (error) {
      console.error('Erro ao comentar no post', error)
      showToast('Não foi possível publicar o comentário. Tente novamente.')
    } finally {
      setIsCommenting(false)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      dispatch(markNotificationAsRead(notification.id))

      if (notification.type === 'like' || notification.type === 'comment') {
        let post: Post | undefined | null = null

        if (notification.post_id) {
          post = posts.find((item) => item.id === notification.post_id)
        }

        if (!post && notification.post) {
          post = posts.find((item) => item.id === notification.post)
        }

        if (post) {
          dispatch(setSelectedPost(null))
          setTimeout(() => {
            dispatch(setSelectedPost(post!))
            setShowAllComments(false)
          }, 0)
        }
      } else if (notification.type === 'follow') {
        navigate(`/profile/${notification.actor_username}`)
      }
    } catch (error) {
      console.error('Erro ao abrir notificação:', error)
    }
  }

  const handleCommentClick = (post: Post) => {
    dispatch(setSelectedPost(post))
    dispatch(fetchComments(post.id))
    setShowAllComments(false)
  }

  const handleViewModeChange = (mode: 'world' | 'following') => {
    if (mode === viewMode) return
    setViewMode(mode)
    setVisibleCount(5)
  }

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  const handleTagClick = async (tagName: string) => {
    setActiveTag(tagName)
    dispatch(setSelectedPost(null))
    setShowAllComments(false)
    await applyTagFilter(tagName)
  }

  const handleClearTagFilter = () => {
    setActiveTag(null)
    setFilteredPosts([])
    setFilterError(null)
    setIsFiltering(false)
    setVisibleCount(5)
  }

  const handleRequestDelete = (post: Post) => {
    if (!userId || post.author !== userId) {
      return
    }

    setPostPendingDeletion(post)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  const handleCancelDelete = () => {
    if (isDeletingPost) return
    setIsDeleteModalOpen(false)
    setPostPendingDeletion(null)
    setDeleteError(null)
  }

  const handleConfirmDelete = async () => {
    if (!postPendingDeletion || !userId) {
      return
    }

    setIsDeletingPost(true)
    setDeleteError(null)

    try {
      await dispatch(deletePost(postPendingDeletion.id)).unwrap()
      await refreshTags()
      if (activeTag) {
        await applyTagFilter(activeTag)
      }
      setIsDeleteModalOpen(false)
      setPostPendingDeletion(null)
      showToast('Post removido com sucesso.')
    } catch (error) {
      console.error('Erro ao apagar post', error)
      setDeleteError('Não foi possível apagar este post. Tente novamente.')
      showToast('Não foi possível apagar o post.')
    } finally {
      setIsDeletingPost(false)
    }
  }

  const basePosts = activeTag ? filteredPosts : Array.isArray(posts) ? posts : []
  const filteredByViewMode = viewMode === 'following'
    ? basePosts.filter((post) => followingIds.includes(post.author))
    : basePosts
  const postsAfterSelected = filteredByViewMode
  const derivedFilterError = activeTag
    ? filterError ?? (postsAfterSelected.length === 0 ? `Nenhum post encontrado para #${activeTag}` : null)
    : null
  const visiblePosts = postsAfterSelected.slice(0, visibleCount)
  const hasMorePosts = postsAfterSelected.length > visibleCount
  const isLoadingPosts = activeTag
    ? isFiltering || (viewMode === 'following' && isFollowingLoading)
    : viewMode === 'following'
      ? isFollowingLoading || !Array.isArray(posts)
      : !Array.isArray(posts)
  const canShowLoadMore = !isLoadingPosts && !derivedFilterError && hasMorePosts
  const emptyMessage = activeTag
    ? `Nenhum post encontrado para #${activeTag}.`
    : viewMode === 'following'
      ? 'Ainda não há posts de quem você segue.'
      : 'Nenhum post ainda'

  const commentsForPost = selectedPost
    ? comments.filter((comment) => comment.post === selectedPost.id)
    : []
  const unreadNotifications = notifications.filter((notification) => !notification.is_read)
  const notificationsToDisplay = unreadNotifications.slice(0, showAll ? undefined : 5)
  const hasUnreadNotifications = unreadNotifications.length > 0

  return (
    <S.Container>
      <S.Header>
        <h1>GreenTweet</h1>
        <S.SearchWrapper className="feed-search">
          <SearchBar onPostSelect={handleCommentClick} />
        </S.SearchWrapper>
        <button className="logout-btn" onClick={handleLogout}>
          Sair
        </button>
      </S.Header>

      <S.Content>
        <S.Main>
          <S.NewTweetWrapper>
            <S.TweetInput
              placeholder="No que você está pensando?"
              value={newPost}
              onChange={(event) => {
                setNewPost(event.target.value)
                if (postImageError) {
                  setPostImageError(null)
                }
              }}
            />
            <S.FooterNewTweet>
              <div>
                <S.UploadControls>
                  <S.UploadButton>
                    <input type="file" accept="image/*" onChange={handleNewPostImageChange} />
                    {newPostImage ? 'Trocar imagem' : 'Adicionar imagem'}
                  </S.UploadButton>
                  {newPostImagePreview && (
                    <S.RemoveImageButton type="button" onClick={handleRemoveNewPostImage}>
                      Remover imagem
                    </S.RemoveImageButton>
                  )}
                </S.UploadControls>
                <S.UploadHint>Formatos PNG, JPG ou GIF. Máximo 2MB.</S.UploadHint>
                {postImageError && <S.ImageError>{postImageError}</S.ImageError>}
                {newPostImagePreview && (
                  <S.ImagePreview>
                    <img src={newPostImagePreview} alt="Prévia do post" />
                  </S.ImagePreview>
                )}
              </div>
              <S.TweetButton
                onClick={handlePostSubmit}
                disabled={isPosting || !userId || (!newPost.trim() && !newPostImage)}
              >
                {isPosting ? 'Publicando...' : 'Publicar'}
              </S.TweetButton>
            </S.FooterNewTweet>
          </S.NewTweetWrapper>

            <S.FeedFilters>
              <S.FilterButton
                type="button"
                className={viewMode === 'following' ? 'active' : ''}
                aria-pressed={viewMode === 'following'}
                onClick={() => handleViewModeChange('following')}
              >
                Seguindo
              </S.FilterButton>
              <S.FilterButton
                type="button"
                className={viewMode === 'world' ? 'active' : ''}
                aria-pressed={viewMode === 'world'}
                onClick={() => handleViewModeChange('world')}
              >
                Mundo
              </S.FilterButton>
            </S.FeedFilters>

          {activeTag && (
            <S.TagFilterBanner>
              <span>
                Exibindo posts com <strong>#{activeTag}</strong>
              </span>
              <button type="button" onClick={handleClearTagFilter}>
                Limpar filtro
              </button>
            </S.TagFilterBanner>
          )}

          <S.TweetsWrapper>
            {isLoadingPosts ? (
              <p>Carregando posts...</p>
            ) : derivedFilterError ? (
              <S.TagInfo className="error">{derivedFilterError}</S.TagInfo>
            ) : visiblePosts.length === 0 ? (
              <p>{emptyMessage}</p>
            ) : (
              visiblePosts.map((post: Post) => (
                selectedPost && selectedPost.id === post.id ? (
                  <PostHighlight
                    key={`highlight-${post.id}`}
                    post={selectedPost}
                    comments={commentsForPost}
                    showAllComments={showAllComments}
                    onToggleLike={(postItem) => {
                      void toggleLikeIfAuthenticated(dispatch, userId, postItem, showToast)
                    }}
                    canDelete={Boolean(userId && selectedPost.author === userId)}
                    onDelete={handleRequestDelete}
                    onComment={handleCommentClick}
                    onAddComment={handleAddComment}
                    onToggleShowComments={() => setShowAllComments((prev) => !prev)}
                    onClose={() => dispatch(setSelectedPost(null))}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    isCommenting={isCommenting}
                  />
                ) : (
                  <PostCard
                    key={post.id}
                    post={post}
                    canDelete={Boolean(userId && post.author === userId)}
                    onDelete={handleRequestDelete}
                    onToggleLike={(postItem) => {
                      void toggleLikeIfAuthenticated(dispatch, userId, postItem, showToast)
                    }}
                    onComment={handleCommentClick}
                  />
                )
              ))
            )}
          </S.TweetsWrapper>

          {canShowLoadMore && (
            <S.LoadMoreButton type="button" onClick={handleLoadMore}>
              Ver mais
            </S.LoadMoreButton>
          )}

          <ConfirmModal
            open={isDeleteModalOpen}
            title="Apagar post"
            description="Tem certeza que deseja apagar este post? Essa ação não pode ser desfeita."
            confirmLabel={isDeletingPost ? 'Apagando...' : 'Apagar'}
            cancelLabel="Cancelar"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            confirmDisabled={isDeletingPost}
            cancelDisabled={isDeletingPost}
            errorMessage={deleteError}
          />
        </S.Main>

        <S.Aside>
          {profile && (
            <S.ProfileCard>
              <img
                src={profile.avatar || defaultAvatar}
                alt={profile.username}
                onError={(event) => {
                  (event.currentTarget as HTMLImageElement).src = defaultAvatar
                }}
              />
              <Link to={`/profile/${profile.username}`}>
                <h2>@{profile.username}</h2>
              </Link>
              <p>{profile.bio}</p>
              <S.FollowInfo>
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${profile.username}?tab=following`)}
                >
                  <strong>{followingCount}</strong> Seguindo
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${profile.username}?tab=followers`)}
                >
                  <strong>{followersCount}</strong> Seguidores
                </button>
              </S.FollowInfo>
              <S.Buttons className="">
                <S.SeeMoreButton onClick={() => navigate(`/profile/${profile.username}`)}>
                  Ver perfil
                </S.SeeMoreButton>
                <S.SeeMoreButton onClick={() => navigate(`/profile/${profile.username}?edit=true`)}>
                  Editar perfil
                </S.SeeMoreButton>
              </S.Buttons>
            </S.ProfileCard>
          )}

          <S.TagsSection>
            <h3>Hashtags em alta</h3>
            {isTagsLoading ? (
              <S.TagInfo>Carregando hashtags...</S.TagInfo>
            ) : tagsError ? (
              <S.TagInfo className="error">{tagsError}</S.TagInfo>
            ) : topTags.length > 0 ? (
              <S.TagList>
                {topTags.map((tag) => (
                  <li key={tag.id}>
                    <S.TagButton type="button" onClick={() => handleTagClick(tag.name)}>
                      <span>#{tag.name}</span>
                      <strong>{tag.posts_count}</strong>
                    </S.TagButton>
                  </li>
                ))}
              </S.TagList>
            ) : (
              <S.TagInfo>Ainda sem hashtags em destaque.</S.TagInfo>
            )}
          </S.TagsSection>

          <S.Notifications>
            <h3>Notificações</h3>
            {hasUnreadNotifications ? (
              <>
                <ul>
                  {notificationsToDisplay.map((notification) => (
                    <li
                      key={notification.id}
                      className={notification.is_read ? 'read' : 'unread'}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {notification.type === 'like' && `${notification.actor_username} curtiu seu post 💚`}
                      {notification.type === 'comment' && `${notification.actor_username} comentou no seu post 💬`}
                      {notification.type === 'follow' && `${notification.actor_username} começou a seguir você 👤`}
                    </li>
                  ))}
                </ul>

                {unreadNotifications.length > 5 && (
                  <S.SeeMoreButton onClick={() => setShowAll((prev) => !prev)}>
                    {showAll ? 'Ver menos' : 'Ver mais'}
                  </S.SeeMoreButton>
                )}
              </>
            ) : (
              <p>Você está em dia com suas notificações.</p>
            )}
          </S.Notifications>
        </S.Aside>
      </S.Content>
    </S.Container>
  )
}

export default Feed