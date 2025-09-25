import styled from 'styled-components'
import { colors, breakpoints, fontSizes, fonts } from '../../styles'

export const CloseButton = styled.button`
  background: ${colors.danger};
  color: ${colors.textLight};
  border: none;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: ${fontSizes.small};
  cursor: pointer;
  margin-left: 94.5%;
  margin-bottom: 8px;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    padding: 4px 8px;
    margin-left: 90%;
  }
`


export const Highlight = styled.div`
  border: 2px solid ${colors.primary};
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 16px;
  background: ${colors.bgDark};
  color: ${colors.textLight};
`

export const ContentPost = styled.div`
  margin-bottom: 12px;
  border: 1px solid ${colors.border}; 
  border-radius: 8px;
  padding: 12px;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
    border: 1px solid ${colors.primary};

    @media (max-width: ${breakpoints.mobile}) {
      width: 40px;
      height: 40px;
    }
  }

  h3 {
    font-family: ${fonts.titles};
    font-size: ${fontSizes.small};
    margin: 0;
    color: ${colors.primary};
  }

  span {
    display: block;
    font-size: 0.8rem;
    color: ${colors.textMuted};
  }
`

export const Content = styled.div`
  margin-bottom: 12px;

  p {
    font-size: ${fontSizes.small};
    margin-bottom: 8px;
    color: ${colors.textLight};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const Image = styled.img`
  width: 100%;
  max-height: 420px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 8px;

  @media (max-width: ${breakpoints.tablet}) {
    max-height: 360px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    max-height: 280px;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-size: ${fontSizes.small};
    color: ${colors.primary};
    font-family: ${fonts.texts};

    &:hover {
      text-decoration: underline;
    }

    &.delete {
      color: ${colors.danger};
      text-decoration: none;

      &:hover {
        color: ${colors.textLight};
        border-radius: 4px;
      }
    }

    &:disabled {
      color: ${colors.muted};
      cursor: not-allowed;
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`

export const Comments = styled.div`
  margin-top: 16px;
  margin-left: 4px;

  h4 {
    margin-bottom: 8px;
    font-size: ${fontSizes.small};
    font-family: ${fonts.titles};
  }

  .comment {
    display: flex;
    align-items: flex-start;
    margin-bottom: 12px;

    img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      margin-right: 8px;
      object-fit: cover;
      border: 1px solid ${colors.primary};
    }

    div {
      background: ${colors.bgDark};
      border: 1px solid ${colors.border};
      padding: 8px 12px;
      border-radius: 8px;
      flex: 1;

      strong {
        display: block;
        font-size: ${fontSizes.small};
        margin-bottom: 4px;
        color: ${colors.primary};
      }

      p {
        margin: 0;
        font-size: ${fontSizes.small};
        color: ${colors.textLight};
      }

      span {
        display: block;
        font-size: 0.75rem;
        color: ${colors.textMuted};
        margin-top: 4px;
      }
    }
  }
`

export const NewComment = styled.div`
  display: flex;
  margin-top: 12px;
  gap: 8px;

  input {
    flex: 1;
    padding: 8px;
    border-radius: 6px;
    border: 1px solid ${colors.border};
    font-size: ${fontSizes.small};
    background: ${colors.bgDark};
    color: ${colors.textLight};

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  button {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: ${colors.primary};
    color: ${colors.textLight};
    cursor: pointer;
    font-size: ${fontSizes.small};

    &:disabled {
      background: ${colors.muted};
      cursor: not-allowed;
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }
`