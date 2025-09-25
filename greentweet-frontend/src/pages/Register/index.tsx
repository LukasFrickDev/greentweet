import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AxiosError } from "axios"
import * as S from "./styles"
import Button from "../../components/Button"
import { authApi } from "../../api/auth"
import api from "../../api/axios"
import { useAppDispatch } from "../../store/hooks"
import { loginSuccess } from "../../store/slices/authSlice"
import { useToast } from "../../hooks/useToast"

const Register = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!form.name.trim()) errs.name = "Nome obrigatório"
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = "E-mail inválido"
    if (form.password.length < 6) errs.password = "Mínimo 6 caracteres"
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Senhas não coincidem"
    if (!form.terms) errs.terms = "Aceite os termos para continuar"
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      const username = form.name.trim()

      await authApi.register({
        username, // backend espera "username"
        email: form.email,
        password: form.password,
      })

      const { data: loginData } = await authApi.login({
        username,
        password: form.password,
      })

      if (!loginData?.access || !loginData?.refresh) {
        throw new Error("Falha ao autenticar após o cadastro.")
      }

      const { data: me } = await api.get("/auth/me/", {
        headers: {
          Authorization: `Bearer ${loginData.access}`,
        },
      })

      dispatch(
        loginSuccess({
          user: me,
          access: loginData.access,
          refresh: loginData.refresh,
        })
      )

      showToast("Cadastro realizado com sucesso! Vamos configurar seu perfil.")
      navigate(`/profile/${username}?edit=true&onboarding=true`, { replace: true })
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const data = err.response?.data as
          | { detail?: string; username?: string | string[]; email?: string | string[] }
          | undefined

        const detailMessage =
          (Array.isArray(data?.username) && data?.username[0]) ||
          (typeof data?.username === "string" && data?.username) ||
          (Array.isArray(data?.email) && data?.email[0]) ||
          (typeof data?.email === "string" && data?.email) ||
          data?.detail

        const message = detailMessage || "Erro ao registrar"
        setErrors({ api: message })
        showToast(message)
      } else if (err instanceof Error) {
        setErrors({ api: err.message })
        showToast(err.message)
      } else {
        setErrors({ api: "Erro inesperado" })
        showToast("Erro inesperado")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <S.Container>
      <S.FormWrapper>
        <S.Title>Cadastrar</S.Title>
        <S.Form onSubmit={handleSubmit}>
          <S.Input
            name="name"
            type="text"
            placeholder="User Name"
            value={form.name}
            onChange={handleChange}
            onFocus={() => setErrors((prev) => ({ ...prev, name: "" }))}
            hasError={!!errors.name}
          />
          {errors.name && <S.ErrorText>{errors.name}</S.ErrorText>}

          <S.Input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setErrors((prev) => ({ ...prev, email: "" }))}
            hasError={!!errors.email}
          />
          {errors.email && <S.ErrorText>{errors.email}</S.ErrorText>}

          <S.Input
            name="password"
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            onFocus={() => setErrors((prev) => ({ ...prev, password: "" }))}
            hasError={!!errors.password}
          />
          {errors.password && <S.ErrorText>{errors.password}</S.ErrorText>}

          <S.Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            value={form.confirmPassword}
            onChange={handleChange}
            onFocus={() => setErrors((prev) => ({ ...prev, confirmPassword: "" }))}
            hasError={!!errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <S.ErrorText>{errors.confirmPassword}</S.ErrorText>
          )}

          <S.CheckboxWrapper>
            <input
              name="terms"
              type="checkbox"
              checked={form.terms}
              onChange={handleChange}
            />
            Aceito os Termos de Uso
          </S.CheckboxWrapper>
          {errors.terms && <S.ErrorText>{errors.terms}</S.ErrorText>}

          {errors.api && <S.ErrorText>{errors.api}</S.ErrorText>}

          <Button
            type="submit"
            title="Entrar"
            variant="primary"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Registrar"}
          </Button>
        </S.Form>

        <S.TextLink>
          Já tem conta? <span onClick={() => navigate("/")}>Faça login</span>
        </S.TextLink>
      </S.FormWrapper>
    </S.Container>
  )
}

export default Register