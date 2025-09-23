import { useNavigate } from 'react-router-dom'
import logo from '../../assets/Logo.png'

import * as S from './styles'
import Button from '../../components/Button'

const Home = () => {
  const navigate = useNavigate()

  return (
    <S.HomeContainer>
      <S.HomeFlex>
        <S.HomeLeft>
          <img src={logo} alt="GreenTweet" />
        </S.HomeLeft>
        <S.HomeRight>
          <h2>Bem-vindo ao GreenTweet</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              navigate('/feed')
            }}
          >
            <input type="email" placeholder="E-mail" required />
            <input type="password" placeholder="Senha" required />
            <Button
              type="submit"
              title="Entrar"
              variant="primary"
              onClick={() => navigate('/')}
            >
              Entrar
            </Button>
          </form>
          <p>ou</p>
          <Button
            type="submit"
            title="Criar conta"
            variant="primary"
            onClick={() => navigate('/register')}
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
