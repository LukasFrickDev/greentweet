import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef } from 'react'
import type { AxiosError } from 'axios'
import * as S from './styles'
import PostCard from '../../components/PostCard'
import PostHighlight from '../../components/PostHighlight'
import ConfirmModal from '../../components/ConfirmModal'
import defaultAvatar from '../../assets/Logo.png'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { followsApi } from '../../api/follows'
import { usersApi } from '../../api/users'
import type { Post } from '../../types/Post'
import type { Profile, UpdateProfilePayload } from '../../types/Profile'
import type { Follow } from '../../types/Follow'
import type { Notification } from '../../types/Notification'
import {
  addComment,
  setSelectedPost,
  fetchPostsByUser,
  fetchComments,
  deletePost,
  fetchNotifications,
  markNotificationAsRead,
} from '../../store/slices/postSlice'
import { toggleLikeIfAuthenticated } from '../../utils/likes'
import SearchBar from '../../components/SearchBar'
import { useToast } from '../../hooks/useToast'

import type { ChangeEvent } from 'react'

type ProfileViewMode = 'posts' | 'notifications' | 'followers' | 'following'

type FollowPreview = {
  id: string
  username: string | null
  displayName: string
  avatar: string | null
  userId: number | null
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()

  const loggedUser = useAppSelector((s) => s.auth.user)
  const posts = useAppSelector((s) => s.posts.posts)
  const selectedPost = useAppSelector((s) => s.posts.selectedPost)
  const comments = useAppSelector((s) => s.posts.comments)
  const notifications = useAppSelector((s) => s.posts.notifications)
  const loggedUserId = loggedUser?.id ?? null

  const [profile, setProfile] = useState<Profile | null>(null)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followId, setFollowId] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isOnboarding, setIsOnboarding] = useState(false)
  const [editData, setEditData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    bio: '',
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarCleared, setAvatarCleared] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [usernameWarning, setUsernameWarning] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [newComment, setNewComment] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [postPendingDeletion, setPostPendingDeletion] = useState<Post | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ProfileViewMode>('posts')
  const [visiblePostsCount, setVisiblePostsCount] = useState(5)
  const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(5)
  const [visibleFollowersCount, setVisibleFollowersCount] = useState(5)
  const [visibleFollowingCount, setVisibleFollowingCount] = useState(5)
  const [followersList, setFollowersList] = useState<FollowPreview[]>([])
  const [followingList, setFollowingList] = useState<FollowPreview[]>([])
  const [followersLoading, setFollowersLoading] = useState(false)
  const [followingLoading, setFollowingLoading] = useState(false)

  const profileId = profile?.id ?? null

  const avatarObjectUrlRef = useRef<string | null>(null)

  const clearAvatarObjectUrl = useCallback(() => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current)
      avatarObjectUrlRef.current = null
    }
  }, [])

  const resetAvatarState = useCallback((avatarUrl: string | null) => {
    clearAvatarObjectUrl()
    setAvatarFile(null)
    setAvatarPreview(avatarUrl)
    setAvatarCleared(false)
  }, [clearAvatarObjectUrl])

  const handleAvatarFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      event.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      setFormError('Envie apenas arquivos de imagem para o avatar.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setFormError('A imagem do avatar não pode ultrapassar 2MB.')
      event.target.value = ''
      return
    }

    clearAvatarObjectUrl()
    const objectUrl = URL.createObjectURL(file)
    avatarObjectUrlRef.current = objectUrl
    setAvatarPreview(objectUrl)
    setAvatarFile(file)
    setAvatarCleared(false)
    setFormError(null)
    event.target.value = ''
  }

  const handleAvatarRemove = () => {
    clearAvatarObjectUrl()
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarCleared(true)
  }

  const mapFollowEntries = useCallback(
    (entries: Follow[], role: 'follower' | 'following'): FollowPreview[] => {
      const results: FollowPreview[] = []
      const seenUsers = new Set<number | string>()

      entries.forEach((entry) => {
        if (!entry) return

        const profileData = role === 'follower' ? entry.follower_profile : entry.following_profile
        const username = (role === 'follower' ? entry.follower_username : entry.following_username)
          ?? profileData?.username
          ?? null
        const userId = role === 'follower' ? entry.follower : entry.following
        const firstName = profileData?.first_name?.trim() ?? ''
        const lastName = profileData?.last_name?.trim() ?? ''
        const displayNameCandidate = [firstName, lastName].filter(Boolean).join(' ').trim()
        const displayName = displayNameCandidate || username || `Usuário #${userId ?? entry.id}`
        const avatar = profileData?.avatar ?? null

        const seenKey = userId ?? entry.id
        if (seenUsers.has(seenKey)) {
          return
        }
        seenUsers.add(seenKey)

        results.push({
          id: String(entry.id),
          username,
          displayName,
          avatar,
          userId,
        })
      })

      return results
    },
    []
  )

  const userPosts: Post[] = profile
    ? posts.filter((post) => post.author_username === profile.username)
    : []
  const totalPostsCount = userPosts.length
  const filteredPosts = selectedPost
    ? userPosts.filter((p) => p.id !== selectedPost.id)
    : userPosts
  const visiblePosts = filteredPosts.slice(0, visiblePostsCount)
  const hasMorePosts = filteredPosts.length > visiblePostsCount
  const visibleNotifications = notifications.slice(0, visibleNotificationsCount)
  const hasMoreNotifications = notifications.length > visibleNotificationsCount
  const visibleFollowers = followersList.slice(0, visibleFollowersCount)
  const hasMoreFollowers = followersList.length > visibleFollowersCount
  const visibleFollowing = followingList.slice(0, visibleFollowingCount)
  const hasMoreFollowing = followingList.length > visibleFollowingCount
  const headerInfo = (() => {
    switch (viewMode) {
      case 'notifications':
        return { label: 'Notificações', count: notifications.length }
      case 'followers':
        return { label: 'Seguidores', count: followersCount }
      case 'following':
        return { label: 'Seguindo', count: followingCount }
      default:
        return { label: 'Posts', count: totalPostsCount }
    }
  })()
  const unreadNotificationsCount = notifications.reduce(
    (count, notification) => count + (notification.is_read ? 0 : 1),
    0
  )

  const isOwnProfile = Boolean(
    profile && (
      (loggedUser?.username && loggedUser.username === profile.username) ||
      (loggedUserId && loggedUserId === profile.user_id)
    )
  )

  const fetchFollowStats = useCallback(async (profileId: number) => {
    try {
      const [{ data: followersRaw }, { data: followingRaw }] = await Promise.all([
        followsApi.listFollowers(profileId),
        followsApi.listFollowing(profileId),
      ])

      const followersArray = Array.isArray(followersRaw) ? (followersRaw as Follow[]) : []
      const followingArray = Array.isArray(followingRaw) ? (followingRaw as Follow[]) : []

      setFollowersCount(followersArray.length)
      setFollowingCount(followingArray.length)

      if (loggedUserId) {
        const follow = followersArray.find((f) => f.follower === loggedUserId)
        setIsFollowing(Boolean(follow))
        setFollowId(follow ? follow.id : null)
      } else {
        setIsFollowing(false)
        setFollowId(null)
      }
    } catch (error) {
      console.error('Erro ao carregar informações de seguidores', error)
    }
  }, [loggedUserId])

  const loadFollowersList = useCallback(async () => {
    if (!profileId) return
    setFollowersLoading(true)

    try {
      const { data } = await followsApi.listFollowers(profileId)
      const dataArray = Array.isArray(data) ? (data as Follow[]) : []

      setFollowersCount(dataArray.length)
      setFollowersList(mapFollowEntries(dataArray, 'follower'))

      if (loggedUserId) {
        const follow = dataArray.find((item) => item.follower === loggedUserId)
        setIsFollowing(Boolean(follow))
        setFollowId(follow ? follow.id : null)
      }
    } catch (error) {
      console.error('Erro ao carregar lista de seguidores', error)
      setFollowersList([])
    } finally {
      setFollowersLoading(false)
    }
  }, [profileId, mapFollowEntries, loggedUserId])

  const loadFollowingList = useCallback(async () => {
    if (!profileId) return
    setFollowingLoading(true)

    try {
      const { data } = await followsApi.listFollowing(profileId)
      const dataArray = Array.isArray(data) ? (data as Follow[]) : []

      setFollowingCount(dataArray.length)
      setFollowingList(mapFollowEntries(dataArray, 'following'))
    } catch (error) {
      console.error('Erro ao carregar lista de perfis seguidos', error)
      setFollowingList([])
    } finally {
      setFollowingLoading(false)
    }
  }, [profileId, mapFollowEntries])

  // abrir edição se vier com ?edit=true
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const shouldEdit = params.get("edit") === "true"
    const onboardingParam = params.get("onboarding") === "true"

    if (shouldEdit) {
      setIsEditing(true)
      setFormError(null)
      setUsernameWarning(false)
    }

    setIsOnboarding(onboardingParam)
  }, [location])

  // carregar perfil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!username) return
        const { data } = await usersApi.detail(username)
        setProfile(data)
        setEditData({
          username: data.username,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          bio: data.bio || '',
        })
        resetAvatarState(data.avatar || null)
        setUsernameWarning(false)
        setFormError(null)

        await fetchFollowStats(data.id)
      } catch (err) {
        console.error('Erro ao carregar perfil', err)
      }
    }
    loadProfile()
  }, [username, fetchFollowStats, resetAvatarState])

  useEffect(() => {
    if (!username) return
    setLoadingPosts(true)
    dispatch(fetchPostsByUser(username))
      .unwrap()
      .catch((err) => {
        console.error('Erro ao carregar posts do usuário', err)
      })
      .finally(() => setLoadingPosts(false))
  }, [dispatch, username])

  useEffect(() => {
    if (!profile || !loggedUserId || profile.user_id !== loggedUserId) return
    dispatch(fetchNotifications())
  }, [dispatch, profile, loggedUserId])

  useEffect(() => {
    if (!profile) return

    const params = new URLSearchParams(location.search)
    const tabParam = params.get('tab')
    let desiredMode: ProfileViewMode = 'posts'

    switch (tabParam) {
      case 'notifications':
        desiredMode = 'notifications'
        break
      case 'followers':
        desiredMode = 'followers'
        break
      case 'following':
        desiredMode = 'following'
        break
      case 'posts':
      default:
        desiredMode = 'posts'
        break
    }

    if (!isOwnProfile && desiredMode === 'notifications') {
      desiredMode = 'posts'
    }

    if (desiredMode !== viewMode) {
      setViewMode(desiredMode)
    }
  }, [location.search, isOwnProfile, profile, viewMode])

  useEffect(() => {
    if (!isOwnProfile && viewMode === 'notifications') {
      setViewMode('posts')
    }
  }, [isOwnProfile, viewMode])

  useEffect(() => {
    setVisiblePostsCount(5)
  }, [profile?.username, totalPostsCount])

  useEffect(() => {
    setVisibleFollowersCount(5)
  }, [profile?.username, followersList.length])

  useEffect(() => {
    setVisibleFollowingCount(5)
  }, [profile?.username, followingList.length])

  useEffect(() => {
    if (viewMode === 'notifications') {
      setVisibleNotificationsCount(5)
    }

    if (viewMode === 'followers') {
      setVisibleFollowersCount(5)
    }

    if (viewMode === 'following') {
      setVisibleFollowingCount(5)
    }
  }, [viewMode])

  useEffect(() => {
    if (!profileId) return

    if (viewMode === 'followers') {
      void loadFollowersList()
    }

    if (viewMode === 'following') {
      void loadFollowingList()
    }
  }, [profileId, viewMode, loadFollowersList, loadFollowingList])

  const handleOpenPost = useCallback(
    (postItem: Post) => {
      dispatch(setSelectedPost(postItem))
      dispatch(fetchComments(postItem.id))
      setShowAllComments(false)
    },
    [dispatch, setShowAllComments]
  )

  useEffect(() => {
    return () => {
      clearAvatarObjectUrl()
    }
  }, [clearAvatarObjectUrl])

  const handleViewModeChange = (mode: ProfileViewMode) => {
    const resolvedMode: ProfileViewMode = !isOwnProfile && mode === 'notifications' ? 'posts' : mode

    if (resolvedMode === viewMode) {
      if (mode !== resolvedMode) {
        const params = new URLSearchParams(location.search)
        if (params.get('tab') === 'notifications') {
          params.delete('tab')
          const searchString = params.toString()
          navigate({ pathname: location.pathname, search: searchString ? `?${searchString}` : '' }, { replace: true })
        }
      }
      return
    }

    const params = new URLSearchParams(location.search)
    const currentTab = params.get('tab')
    const targetTab = resolvedMode === 'posts' ? null : resolvedMode

    let shouldNavigate = false
    if (targetTab === null) {
      if (currentTab) {
        params.delete('tab')
        shouldNavigate = true
      }
    } else if (currentTab !== targetTab) {
      params.set('tab', targetTab)
      shouldNavigate = true
    }

    if (shouldNavigate) {
      const searchString = params.toString()
      navigate({ pathname: location.pathname, search: searchString ? `?${searchString}` : '' }, { replace: true })
    }

    if (resolvedMode !== 'posts') {
      dispatch(setSelectedPost(null))
      setShowAllComments(false)
    }

    if (resolvedMode === 'notifications') {
      setVisibleNotificationsCount(5)
    } else if (resolvedMode === 'followers') {
      setVisibleFollowersCount(5)
    } else if (resolvedMode === 'following') {
      setVisibleFollowingCount(5)
    } else {
      setVisiblePostsCount(5)
    }

    setViewMode(resolvedMode)
  }

  const handleLoadMorePosts = () => {
    setVisiblePostsCount((prev) => prev + 5)
  }

  const handleLoadMoreNotifications = () => {
    setVisibleNotificationsCount((prev) => prev + 5)
  }

  const handleLoadMoreFollowers = () => {
    setVisibleFollowersCount((prev) => prev + 5)
  }

  const handleLoadMoreFollowing = () => {
    setVisibleFollowingCount((prev) => prev + 5)
  }

  const handleNavigateToProfile = (profileUsername: string | null) => {
    if (!profileUsername) return
    navigate(`/profile/${profileUsername}`)
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
          setShowAllComments(false)

          if (viewMode !== 'posts') {
            handleViewModeChange('posts')
          }

          setTimeout(() => {
            handleOpenPost(post as Post)
          }, 0)
        }
      } else if (notification.type === 'follow') {
        navigate(`/profile/${notification.actor_username}`)
      }
    } catch (error) {
      console.error('Erro ao abrir notificação:', error)
    }
  }

  const handleUsernameChange = (value: string) => {
    const sanitized = value.replace(/\s+/g, '')
    setUsernameWarning(value !== sanitized)
    setFormError(null)
    setEditData((prev) => ({ ...prev, username: sanitized }))
  }

  const handleSaveProfile = async () => {
    if (!profile) return
    if (!editData.username) {
      setUsernameWarning(true)
      return
    }

    const payload: UpdateProfilePayload = {}
    let hasChanges = false

    if (editData.username !== profile.username) {
      payload.username = editData.username
      hasChanges = true
    }

    if ((editData.first_name || '') !== (profile.first_name || '')) {
      payload.first_name = editData.first_name
      hasChanges = true
    }

    if ((editData.last_name || '') !== (profile.last_name || '')) {
      payload.last_name = editData.last_name
      hasChanges = true
    }

    if ((editData.bio || '') !== (profile.bio || '')) {
      payload.bio = editData.bio
      hasChanges = true
    }

    if (avatarFile) {
      payload.avatar = avatarFile
      hasChanges = true
    } else if (avatarCleared && profile.avatar) {
      payload.avatar = null
      hasChanges = true
    }

    if (!hasChanges) {
      setUsernameWarning(false)
      setFormError(null)
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      const { data } = await usersApi.update(profile.id, payload)
      setProfile(data)
      setEditData({
        username: data.username,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        bio: data.bio || '',
      })
      resetAvatarState(data.avatar || null)
      setUsernameWarning(false)
      setFormError(null)
      dispatch(fetchPostsByUser(data.username))
      if (isOnboarding) {
        setIsOnboarding(false)
        navigate('/feed', { replace: true })
      } else if (username && username !== data.username) {
        navigate(`/profile/${data.username}`)
      }
      setIsEditing(false)
      showToast('Perfil atualizado com sucesso!')
    } catch (err) {
      const axiosError = err as AxiosError<Record<string, string | string[] | undefined> | string | undefined>
      let message = 'Não foi possível salvar o perfil. Tente novamente.'

      const data = axiosError?.response?.data

      if (typeof data === 'string' && data.trim()) {
        message = data
      } else if (data && typeof data === 'object') {
        const usernameError = data.username
        if (Array.isArray(usernameError) && usernameError.length > 0) {
          message = usernameError[0]
        } else if (typeof usernameError === 'string' && usernameError.trim()) {
          message = usernameError
        } else if (typeof data.detail === 'string' && data.detail.trim()) {
          message = data.detail
        }
      }

      setFormError(message)
      console.error('Erro ao salvar perfil', err)
      showToast(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleFollow = async () => {
    if (!profile || !loggedUserId) return
    const previousFollowState = {
      isFollowing,
      followersCount,
      followId,
    }

    try {
      if (isFollowing && followId) {
        setIsFollowing(false)
        setFollowersCount((prev) => Math.max(prev - 1, 0))
        await followsApi.unfollow(followId)
        setFollowId(null)
        showToast(`Você deixou de seguir ${profile.username}.`)
      } else {
        setIsFollowing(true)
        setFollowersCount((prev) => prev + 1)
        const { data } = await followsApi.follow({
          follower: loggedUserId,
          following: profile.user_id,
        })
        setFollowId(data.id)
        showToast(`Você começou a seguir ${profile.username}!`)
      }

      await fetchFollowStats(profile.id)

      if (viewMode === 'followers') {
        void loadFollowersList()
      } else if (viewMode === 'following') {
        void loadFollowingList()
      }
    } catch (err) {
      setIsFollowing(previousFollowState.isFollowing)
      setFollowersCount(previousFollowState.followersCount)
      setFollowId(previousFollowState.followId)
      console.error("Erro ao seguir/desseguir", err)
      showToast('Não foi possível atualizar o status de seguimento. Tente novamente.')
    }
  }

  const handleAddComment = async (content: string) => {
    if (!content.trim() || !selectedPost) return
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

  const handleRequestDeletePost = (post: Post) => {
    if (!loggedUserId || post.author !== loggedUserId) {
      return
    }

    setPostPendingDeletion(post)
    setDeleteError(null)
    setIsDeleteModalOpen(true)
  }

  const handleCancelDeletePost = () => {
    if (isDeletingPost) return
    setIsDeleteModalOpen(false)
    setPostPendingDeletion(null)
    setDeleteError(null)
  }

  const handleConfirmDeletePost = async () => {
    if (!postPendingDeletion || !loggedUserId) {
      return
    }

    setIsDeletingPost(true)
    setDeleteError(null)

    try {
      await dispatch(deletePost(postPendingDeletion.id)).unwrap()
      setIsDeleteModalOpen(false)
      setPostPendingDeletion(null)
      showToast('Post apagado com sucesso.')
    } catch (error) {
      console.error('Erro ao apagar post', error)
      setDeleteError('Não foi possível apagar este post. Tente novamente.')
      showToast('Não foi possível apagar este post.')
    } finally {
      setIsDeletingPost(false)
    }
  }

  if (!profile) {
    return (
      <S.Container>
        <S.BackButton onClick={() => navigate('/feed')}>← Voltar ao Feed</S.BackButton>
        <p>Usuário não encontrado</p>
      </S.Container>
    )
  }

  const commentsForPost = selectedPost
    ? comments.filter((c) => c.post === selectedPost.id)
    : []

  const avatarSrc = avatarPreview ?? profile.avatar ?? defaultAvatar
  const canRemoveAvatar = Boolean(
    avatarFile || (!avatarCleared && (profile.avatar || avatarPreview))
  )

  return (
    <S.Container>
      <S.TopBar>
        <S.BackButton onClick={() => navigate('/feed')}>← Voltar ao Feed</S.BackButton>
        <S.SearchWrapper>
          <SearchBar onPostSelect={handleOpenPost} />
        </S.SearchWrapper>
      </S.TopBar>

      <S.ProfileHeader>
        <img
          src={avatarSrc}
          alt={editData.username || profile.username}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultAvatar
          }}
        />

        {isOwnProfile && isEditing ? (
          <>
            <S.NameInputs>
              <input
                value={editData.first_name}
                onChange={(e) => setEditData({ ...editData, first_name: e.target.value })}
                placeholder="Nome"
              />
              <input
                value={editData.last_name}
                onChange={(e) => setEditData({ ...editData, last_name: e.target.value })}
                placeholder="Sobrenome"
              />
            </S.NameInputs>
            <input
              value={editData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="Username"
            />
            {usernameWarning && (
              <S.UsernameHint>Removemos espaços automaticamente do username.</S.UsernameHint>
            )}
            <textarea
              value={editData.bio}
              placeholder="Escreva algo sobre você..."
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            />
            <S.AvatarUpload>
              <S.AvatarUploadButton>
                <input type="file" accept="image/*" onChange={handleAvatarFileChange} />
                {avatarFile ? 'Trocar avatar' : 'Escolher avatar'}
              </S.AvatarUploadButton>
              <S.AvatarRemoveButton
                type="button"
                onClick={handleAvatarRemove}
                disabled={!canRemoveAvatar}
              >
                Remover avatar
              </S.AvatarRemoveButton>
            </S.AvatarUpload>
            <S.AvatarHint>Formatos PNG, JPG ou GIF. Máximo 2MB.</S.AvatarHint>
            {formError && <S.ErrorMessage>{formError}</S.ErrorMessage>}
            <div>
              <S.FollowButton onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </S.FollowButton>
              <S.FollowButton
                onClick={() => {
                  setEditData({
                    username: profile.username,
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    bio: profile.bio || '',
                  })
                  resetAvatarState(profile.avatar || null)
                  setUsernameWarning(false)
                  setFormError(null)
                  setIsEditing(false)
                }}
              >
                Cancelar
              </S.FollowButton>
            </div>
          </>
        ) : (
          <>
            <S.NameRow>
              <span>{profile.first_name || '—'}</span>
              <span>{profile.last_name || '—'}</span>
            </S.NameRow>
            <h2>@{profile.username}</h2>
            <p>{profile.bio}</p>

            <S.FollowInfo>
              <button type="button" onClick={() => handleViewModeChange('following')}>
                <strong>{followingCount}</strong> Seguindo
              </button>
              <button type="button" onClick={() => handleViewModeChange('followers')}>
                <strong>{followersCount}</strong> Seguidores
              </button>
            </S.FollowInfo>

            {isOwnProfile ? (
              <S.FollowButton
                onClick={() => {
                  setEditData({
                    username: profile.username,
                    first_name: profile.first_name || '',
                    last_name: profile.last_name || '',
                    bio: profile.bio || '',
                  })
                  resetAvatarState(profile.avatar || null)
                  setUsernameWarning(false)
                  setFormError(null)
                  setIsEditing(true)
                }}
              >
                Editar perfil
              </S.FollowButton>
            ) : (
              <S.FollowButton
                onClick={handleToggleFollow}
                className={isFollowing ? 'unfollow' : 'follow'}
              >
                {isFollowing ? 'Deixar de seguir' : 'Seguir'}
              </S.FollowButton>
            )}
          </>
        )}
      </S.ProfileHeader>

      <S.PostsSection>
        <S.PostsHeader>
          <h3>
            {headerInfo.label} <span>({headerInfo.count})</span>
          </h3>

          <S.PostsTabs>
            <S.PostsTabButton
              type="button"
              className={viewMode === 'posts' ? 'active' : ''}
              onClick={() => handleViewModeChange('posts')}
            >
              Posts
            </S.PostsTabButton>

            {isOwnProfile && (
              <S.PostsTabButton
                type="button"
                className={viewMode === 'notifications' ? 'active' : ''}
                onClick={() => handleViewModeChange('notifications')}
              >
                Notificações ({unreadNotificationsCount})
              </S.PostsTabButton>
            )}

            <S.PostsTabButton
              type="button"
              className={viewMode === 'followers' ? 'active' : ''}
              onClick={() => handleViewModeChange('followers')}
            >
              Seguidores
            </S.PostsTabButton>

            <S.PostsTabButton
              type="button"
              className={viewMode === 'following' ? 'active' : ''}
              onClick={() => handleViewModeChange('following')}
            >
              Seguindo
            </S.PostsTabButton>
          </S.PostsTabs>
        </S.PostsHeader>

        {viewMode === 'posts' && (
          <S.PostList>
            {selectedPost && (
              <PostHighlight
                post={selectedPost}
                comments={commentsForPost}
                showAllComments={showAllComments}
                onToggleLike={(postItem) => {
                  void toggleLikeIfAuthenticated(dispatch, loggedUserId, postItem, showToast)
                }}
                onComment={handleOpenPost}
                onAddComment={handleAddComment}
                onToggleShowComments={() => setShowAllComments((prev) => !prev)}
                onClose={() => dispatch(setSelectedPost(null))}
                canDelete={Boolean(loggedUserId && selectedPost.author === loggedUserId)}
                onDelete={handleRequestDeletePost}
                newComment={newComment}
                setNewComment={setNewComment}
                isCommenting={isCommenting}
              />
            )}

            {loadingPosts ? (
              <p>Carregando posts...</p>
            ) : totalPostsCount > 0 ? (
              <>
                {visiblePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onToggleLike={(postItem) => {
                      void toggleLikeIfAuthenticated(dispatch, loggedUserId, postItem, showToast)
                    }}
                    onComment={handleOpenPost}
                    canDelete={Boolean(loggedUserId && post.author === loggedUserId)}
                    onDelete={handleRequestDeletePost}
                  />
                ))}

                {hasMorePosts && (
                  <S.LoadMoreButton type="button" onClick={handleLoadMorePosts}>
                    Ver mais posts
                  </S.LoadMoreButton>
                )}
              </>
            ) : (
              <p>Este usuário ainda não tem posts.</p>
            )}
          </S.PostList>
        )}

        {viewMode === 'notifications' && (
          <>
            {notifications.length > 0 ? (
              <>
                <S.NotificationsList>
                  {visibleNotifications.map((notification) => (
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
                </S.NotificationsList>

                {hasMoreNotifications && (
                  <S.LoadMoreButton type="button" onClick={handleLoadMoreNotifications}>
                    Ver mais notificações
                  </S.LoadMoreButton>
                )}
              </>
            ) : (
              <p>Você não tem notificações ainda.</p>
            )}
          </>
        )}

        {viewMode === 'followers' && (
          <>
            {followersLoading ? (
              <p>Carregando seguidores...</p>
            ) : followersList.length > 0 ? (
              <>
                <S.FollowList>
                  {visibleFollowers.map((follower) => (
                    <li key={follower.id}>
                      <button
                        type="button"
                        onClick={() => handleNavigateToProfile(follower.username)}
                        disabled={!follower.username}
                      >
                        <img
                          src={follower.avatar || defaultAvatar}
                          alt={follower.username ? `@${follower.username}` : follower.displayName}
                          onError={(event) => {
                            (event.currentTarget as HTMLImageElement).src = defaultAvatar
                          }}
                        />
                        <div>
                          <strong>{follower.displayName}</strong>
                          <span>
                            {follower.username ? `@${follower.username}` : 'Perfil indisponível'}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </S.FollowList>

                {hasMoreFollowers && (
                  <S.LoadMoreButton type="button" onClick={handleLoadMoreFollowers}>
                    Ver mais seguidores
                  </S.LoadMoreButton>
                )}
              </>
            ) : (
              <p>Nenhum seguidor por aqui ainda.</p>
            )}
          </>
        )}

        {viewMode === 'following' && (
          <>
            {followingLoading ? (
              <p>Carregando perfis seguidos...</p>
            ) : followingList.length > 0 ? (
              <>
                <S.FollowList>
                  {visibleFollowing.map((following) => (
                    <li key={following.id}>
                      <button
                        type="button"
                        onClick={() => handleNavigateToProfile(following.username)}
                        disabled={!following.username}
                      >
                        <img
                          src={following.avatar || defaultAvatar}
                          alt={following.username ? `@${following.username}` : following.displayName}
                          onError={(event) => {
                            (event.currentTarget as HTMLImageElement).src = defaultAvatar
                          }}
                        />
                        <div>
                          <strong>{following.displayName}</strong>
                          <span>
                            {following.username ? `@${following.username}` : 'Perfil indisponível'}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </S.FollowList>

                {hasMoreFollowing && (
                  <S.LoadMoreButton type="button" onClick={handleLoadMoreFollowing}>
                    Ver mais seguindo
                  </S.LoadMoreButton>
                )}
              </>
            ) : (
              <p>Este perfil ainda não segue ninguém.</p>
            )}
          </>
        )}
      </S.PostsSection>

      <ConfirmModal
        open={isDeleteModalOpen}
        title="Apagar post"
        description="Tem certeza que deseja apagar este post? Essa ação não pode ser desfeita."
        confirmLabel={isDeletingPost ? 'Apagando...' : 'Apagar'}
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDeletePost}
        onCancel={handleCancelDeletePost}
        confirmDisabled={isDeletingPost}
        cancelDisabled={isDeletingPost}
        errorMessage={deleteError}
      />
    </S.Container>
  )
}

export default ProfilePage