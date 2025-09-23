import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import * as S from './styles'
import Button from '../../components/Button'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validate = () => {
    const errs: { [key: string]: string } = {}
    if (!form.name.trim()) errs.name = 'Nome obrigatório'
    if (!form.email.match(/^\S+@\S+\.\S+$/)) errs.email = 'E-mail inválido'
    if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Senhas não coincidem'
    if (!form.terms) errs.terms = 'Aceite os termos para continuar'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      await axios.post('/api/signup', {
        name: form.name,
        email: form.email,
        password: form.password
      })
      navigate('/')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrors({ api: err.response?.data?.message || 'Erro ao registrar' })
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
            hasError={!!errors.name}
          />
          {errors.name && <S.ErrorText>{errors.name}</S.ErrorText>}

          <S.Input
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            hasError={!!errors.email}
          />
          {errors.email && <S.ErrorText>{errors.email}</S.ErrorText>}

          <S.Input
            name="password"
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            hasError={!!errors.password}
          />
          {errors.password && <S.ErrorText>{errors.password}</S.ErrorText>}

          <S.Input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar senha"
            value={form.confirmPassword}
            onChange={handleChange}
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
            {loading ? 'Cadastrando...' : 'Registrar'}
          </Button>
        </S.Form>

        <S.TextLink>
          Já tem conta? <span onClick={() => navigate('/')}>Faça login</span>
        </S.TextLink>
      </S.FormWrapper>
    </S.Container>
  )
}

export default Register
