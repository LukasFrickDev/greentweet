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

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  font-size: ${fontSizes.small};
  cursor: pointer;
  margin: 0;
  font-family: ${fonts.texts};

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const SearchWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    justify-content: center;
  }
`

export const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;

  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    border: 2px solid ${colors.primary};

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

  input:not([type='file']),
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

  export const NameRow = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
    font-family: ${fonts.titles};
    color: ${colors.textLight};
    font-size: ${fontSizes.medium};

    span {
      font-weight: 600;
    }

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.medium};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};
    }
  `

  export const NameInputs = styled.div`
    display: flex;
    gap: 0.75rem;
    width: 100%;
    max-width: 400px;
    margin: 0.3rem 0;

    input {
      flex: 1;
    }

    @media (max-width: ${breakpoints.mobile}) {
      flex-direction: column;
      gap: 0.5rem;

      input {
        width: 100%;
      }
    }
  `

  export const UsernameHint = styled.span`
    font-size: ${fontSizes.small};
    color: ${colors.secondary};
    font-family: ${fonts.texts};
    margin-top: 0.25rem;
  `

  export const ErrorMessage = styled.span`
    margin-top: 0.5rem;
    color: ${colors.danger};
    font-size: ${fontSizes.small};
    font-family: ${fonts.texts};
  `

export const AvatarUpload = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
`

export const AvatarUploadButton = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1.2rem;
  border: 1px dashed ${colors.primary};
  border-radius: 999px;
  color: ${colors.primary};
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  &:hover {
    background: rgba(29, 156, 90, 0.15);
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const AvatarRemoveButton = styled.button`
  border: 1px solid ${colors.danger};
  background: transparent;
  color: ${colors.danger};
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: ${colors.danger};
    color: ${colors.textLight};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const AvatarHint = styled.span`
  display: block;
  margin-top: 0.35rem;
  color: ${colors.textMuted};
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const FollowInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;

  button {
    background: transparent;
    border: none;
    font-size: ${fontSizes.small};
    color: ${colors.textLight};
    font-family: ${fonts.texts};
    display: flex;
    align-items: center;
    gap: 0.4rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;

    strong {
      color: ${colors.primary};
    }

    &:hover {
      color: ${colors.primary};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: 1.2rem;
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
  margin-left: 0.5rem;
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

  p {
    color: ${colors.textLight};
    font-family: ${fonts.texts};
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 1rem;
  }
`

export const PostsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  h3 {
    margin: 0;
    font-size: ${fontSizes.medium};
    font-family: ${fonts.titles};
    color: ${colors.textLight};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    span {
      font-family: ${fonts.texts};
      font-size: ${fontSizes.small};
      color: ${colors.textMuted};
    }

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.medium};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.medium};

      span {
        font-size: ${fontSizes.mobile.small};
      }
    }
  }
`

export const PostsTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`

export const PostsTabButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: ${colors.textMuted};
  font-family: ${fonts.texts};
  font-size: ${fontSizes.small};
  border-radius: 999px;
  padding: 0.35rem 1.1rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &.active {
    background: ${colors.primary};
    color: ${colors.textLight};
    border-color: ${colors.primary};
      &:hover {
        background: transparent;  
      }
    }

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    flex: 1 1 auto;
  }
`

export const NotificationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    padding: 0.9rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(21, 33, 31, 0.85);
    color: ${colors.textLight};
    font-size: ${fontSizes.small};
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.1s ease;

    &.unread {
      border-color: ${colors.primary};
      color: ${colors.primary};
      font-weight: 600;
    }

    &:hover {
      border-color: ${colors.primary};
      transform: translateY(-1px);
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const FollowList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  li {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    overflow: hidden;
    background: rgba(21, 33, 31, 0.85);

    button {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      color: ${colors.textLight};
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease, transform 0.1s ease;

      &:hover:not(:disabled) {
        background: rgba(29, 156, 90, 0.08);
        transform: translateY(-1px);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      img {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      div {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }

      strong {
        font-family: ${fonts.texts};
        font-size: ${fontSizes.small};
        color: ${colors.textLight};
      }

      span {
        font-size: ${fontSizes.small};
        color: ${colors.textMuted};
      }

      @media (max-width: ${breakpoints.mobile}) {
        gap: 0.65rem;
        padding: 0.7rem 0.85rem;

        img {
          width: 40px;
          height: 40px;
        }

        strong {
          font-size: ${fontSizes.mobile.small};
        }

        span {
          font-size: ${fontSizes.mobile.small};
        }
      }
    }
  }
`

export const LoadMoreButton = styled.button`
  margin: 1rem auto 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  border-radius: 999px;
  padding: 0.45rem 1.4rem;
  font-size: ${fontSizes.small};
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${colors.primary};
    color: ${colors.textLight};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`