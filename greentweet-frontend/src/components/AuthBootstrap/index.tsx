// src/components/AuthBootstrap.tsx
import { useEffect } from "react"
import { authApi } from "../../api/auth"
import { loginSuccess, logout } from "../../store/slices/authSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"

export const AuthBootstrap = () => {
  const dispatch = useAppDispatch()
  const { access, refresh } = useAppSelector((s) => s.auth)

  useEffect(() => {
    const bootstrap = async () => {
      if (!access || !refresh) return
      try {
        const { data: me } = await authApi.me()
        dispatch(loginSuccess({ user: me, access, refresh }))
      } catch {
        dispatch(logout())
      }
    }
    bootstrap()
  }, [access, refresh, dispatch])

  return null
}