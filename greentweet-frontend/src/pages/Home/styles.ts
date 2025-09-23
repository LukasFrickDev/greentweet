import styled from 'styled-components'
import { colors, fonts } from '../../styles'

export const HomeContainer = styled.div`
  height: 100vh;
  background: ${colors.bgDark};
  color: ${colors.textLight};

  h1 {
    font-family: ${fonts.titles};
    font-size: 2rem;
    color: ${colors.primary};
    text-align: center;
    position: absolute;
    bottom: 300px;
    width: 100%;
  }
`

export const HomeFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 80vh;
`

export const HomeLeft = styled.div`
  flex: 1;
  margin-left: 50rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 400px;
    padding-right: 2rem;
  }
`

export const HomeRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 50rem;
  padding: 2rem;
  border-radius: 8px;
  background: ${colors.textMuted};

  h2 {
    font-family: ${fonts.titles};
    font-size: 22px;
    color: ${colors.textLight};
    padding-bottom: 1rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 280px;
  }

  input {
    padding: 0.75rem;
    border-radius: 4px;
    border: none;
  }

  p {
    margin: 1rem 0;
  }
`
