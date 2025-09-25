import type { AppDispatch } from "../store"
import type { Post } from "../types/Post"
import { toggleLike } from "../store/slices/postSlice"

type ShowToast = (message: string, options?: { duration?: number }) => void

export const toggleLikeIfAuthenticated = (
  dispatch: AppDispatch,
  userId: number | null,
  post: Post | null,
  showToast?: ShowToast,
) => {
  if (!userId || !post) {
    showToast?.("É necessário estar autenticado para curtir posts.")
    return Promise.resolve(undefined)
  }

  const alreadyLiked = Boolean(post.is_liked)

  return dispatch(toggleLike({ post, userId }))
    .unwrap()
    .then((updatedPost) => {
      if (alreadyLiked) {
        showToast?.("Curtida removida.")
      } else {
        showToast?.("Post curtido!")
      }
      return updatedPost
    })
    .catch((error) => {
      console.error("Erro ao alternar curtida", error)
      showToast?.("Não foi possível atualizar a curtida. Tente novamente.")
      return undefined
    })
}
