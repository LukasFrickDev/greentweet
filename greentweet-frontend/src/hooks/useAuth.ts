// src/hooks/useAuth.ts
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AxiosError } from "axios"
import { authApi } from "../api/auth"
import type { LoginPayload, RegisterPayload } from "../types/Auth"
import { loginSuccess, logout } from "../store/slices/authSlice"
import { useToast } from "./useToast"

export function useAuth() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const login = async (payload: LoginPayload) => {
    setLoading(true)
    setError(null)
    try {
      // 1. Faz login → pega tokens
      const { data } = await authApi.login(payload)

      if (data.access && data.refresh) {
        // 2. Busca usuário logado    
        dispatch(
          loginSuccess({
            user: null,
            access: data.access,
            refresh: data.refresh,
          })
        )
  const { data: me } = await authApi.me()


        // 3. Atualiza Redux com user + tokens
        dispatch(
          loginSuccess({
            user: me,
            access: data.access,
            refresh: data.refresh,
          })
        )

        showToast("Login realizado com sucesso!")
        return true
      }
      return false
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          (err.response?.data as { detail?: string })?.detail ||
          "Credenciais inválidas"
        setError(msg)
        showToast(msg)
      } else {
        setError("Erro inesperado")
        showToast("Erro inesperado")
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: RegisterPayload) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.register(payload)
      showToast("Cadastro realizado com sucesso!")
      return true
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          (err.response?.data as { detail?: string })?.detail ||
          "Erro ao registrar"
        setError(msg)
        showToast(msg)
      } else {
        setError("Erro inesperado")
        showToast("Erro inesperado")
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const doLogout = () => {
    dispatch(logout())
  }

  return { login, register, doLogout, loading, error }
}