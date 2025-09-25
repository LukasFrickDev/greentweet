import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/Logo.png"

import * as S from "./styles"
import Button from "../../components/Button"
import { useAuth } from "../../hooks/useAuth"

const Home = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()

  const [form, setForm] = useState({
    username: "", // agora usamos username
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({
      username: form.username,
      password: form.password,
    })
    if (success) {
      navigate("/feed")
    }
  }

  return (
    <S.HomeContainer>
      <S.HomeFlex>
        <S.HomeLeft>
          <img src={logo} alt="GreenTweet" />
        </S.HomeLeft>
        <S.HomeRight>
          <h2>Bem-vindo ao GreenTweet</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Usuário"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && <S.ErrorTexts>Usuário ou senha inválidos</S.ErrorTexts>}

            <Button
              type="submit"
              title="Entrar"
              variant="primary"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p>ou</p>
          <Button
            type="button"
            title="Criar conta"
            variant="primary"
            onClick={() => navigate("/register")}
          >
            Criar conta
          </Button>
        </S.HomeRight>
      </S.HomeFlex>
      <h1>Sua voz, nosso verde</h1>
    </S.HomeContainer>
  )
}

export default Home