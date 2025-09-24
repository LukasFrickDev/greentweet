import styled from 'styled-components'
import { colors, fonts } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const Container = styled.div`
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: ${fontSizes.small};
  cursor: pointer;
  margin-bottom: 1rem;
  font-family: ${fonts.texts};

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;

    @media (max-width: ${breakpoints.mobile}) {
      width: 80px;
      height: 80px;
    }
  }

  h2 {
    margin: 0.5rem 0;
    font-size: ${fontSizes.medium};
    font-family: ${fonts.titles};
    color: ${colors.textLight};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.medium};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  p {
    font-size: ${fontSizes.small};
    color: ${colors.textMuted};
    margin-bottom: 1rem;
    font-family: ${fonts.texts};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.small};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  input,
  textarea {
    width: 100%;
    max-width: 400px;
    margin: 0.3rem 0;
    padding: 0.5rem;
    border: 1px solid ${colors.secondary};
    border-radius: 6px;
    background-color: ${colors.bgDark};
    color: ${colors.textLight};
    font-family: ${fonts.texts};
    resize: none;
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const FollowInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;

  span {
    font-size: ${fontSizes.small};
    color: ${colors.textLight};
    font-family: ${fonts.texts};

    strong {
      color: ${colors.primary};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const FollowButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  background-color: ${colors.primary};
  color: ${colors.textLight};
  font-family: ${fonts.texts};
  margin-top: 0.5rem;
  font-size: ${fontSizes.small};

  &.unfollow {
    background-color: ${colors.secondary};
  }

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const PostsSection = styled.section`
  margin-top: 2rem;

  h3 {
    margin-bottom: 1rem;
    font-size: ${fontSizes.medium};
    font-family: ${fonts.titles};
    color: ${colors.textLight};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.medium};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  p {
    color: ${colors.textMuted};
    font-family: ${fonts.texts};
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`