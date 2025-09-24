import styled from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem;
  background: ${colors.bgDark};
  color: ${colors.textLight};
  min-height: 100vh;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;

  h1 {
    font-family: 'Azonix', sans-serif;
    color: ${colors.primary};
    font-size: ${fontSizes.large};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.large};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.large};
    }
  }
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: ${breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const NewTweetWrapper = styled.div`
  background: #1e2a28;
  border: 1px solid ${colors.textMuted};
  border-radius: 8px;
  padding: 1rem;
`

export const TweetInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${colors.textMuted};
  background: #1e2a28;
  color: ${colors.textLight};
  resize: vertical;
  font-size: ${fontSizes.small};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: ${fontSizes.tablet.small};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const TweetButton = styled.button`
  margin-top: 0.75rem;
  background: ${colors.primary};
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;
  font-size: ${fontSizes.small};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const FollowInfo = styled.div`
  display: flex;
  gap: 1rem;
  font-size: ${fontSizes.small};

  span {
    color: ${colors.textLight};
  }

  strong {
    color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const TweetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Aside = styled.aside`
  background: #1e2a28;
  border: 1px solid ${colors.textMuted};
  border-radius: 8px;
  padding: 1rem;
  height: fit-content;
`

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0.25rem 0;
    font-size: ${fontSizes.medium};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  p {
    font-size: ${fontSizes.small};
    color: ${colors.textMuted};
    margin-bottom: 0.75rem;

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const Notifications = styled.div`
  margin-top: 1.5rem;

  h3 {
    margin-bottom: 0.75rem;
    color: ${colors.primary};
    font-size: ${fontSizes.medium};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  li {
    font-size: ${fontSizes.small};
    padding: 0.5rem;
    border-radius: 4px;
    background: #1e2a28;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  li:hover {
    background: #263632;
  }

  li.unread {
    font-weight: bold;
    border: 1px solid ${colors.primary};
    color: ${colors.textLight};
  }

  li.read {
    border: 1px solid ${colors.textMuted};
    color: ${colors.textMuted};
    font-weight: normal;
  }
`

export const SeeMoreButton = styled.button`
  margin-top: 0.75rem;
  background: transparent;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  font-size: ${fontSizes.small};
  text-align: left;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`