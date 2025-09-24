import styled from 'styled-components'
import { colors, fonts } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const HomeContainer = styled.div`
  height: 100vh;
  background: ${colors.bgDark};
  color: ${colors.textLight};
  position: relative;

  h1 {
    font-family: ${fonts.titles};
    font-size: ${fontSizes.large};
    color: ${colors.primary};
    text-align: center;
    position: absolute;
    bottom: 250px;
    width: 100%;

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.large};
      bottom: 100px;
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.large};
      bottom: 200px;
    }
  }
`

export const HomeFlex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 80vh;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    gap: 2rem;
    height: auto;
    padding: 2rem 1rem;
  }
`

export const HomeLeft = styled.div`
  flex: 1;
  margin-left: 50rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 400px;
    padding-right: 2rem;

    @media (max-width: ${breakpoints.tablet}) {
      width: 300px;
      padding-right: 0;
    }

    @media (max-width: ${breakpoints.mobile}) {
      width: 200px;
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-left: 0;
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
    font-size: ${fontSizes.medium};
    color: ${colors.textLight};
    padding-bottom: 1rem;
    text-align: center;

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.medium};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 280px;

    @media (max-width: ${breakpoints.mobile}) {
      width: 100%;
    }
  }

  input {
    padding: 0.75rem;
    border-radius: 4px;
    border: none;
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  p {
    margin: 1rem 0;
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  @media (max-width: ${breakpoints.tablet}) {
    margin-right: 0;
    width: 100%;
  }
`