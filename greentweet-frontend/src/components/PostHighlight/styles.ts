import styled from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const HighlightedPost = styled.div`
  border: 2px solid ${colors.primary};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`

export const CommentsSection = styled.div`
  margin-top: 12px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 8px 0;
  }

  li {
    margin-bottom: 4px;
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.small};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }

    /* garante que o @username use a cor global */
    .author {
      color: ${colors.primary};
      font-weight: bold;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`

export const CommentInputWrapper = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    gap: 6px;
  }
`

export const CommentInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: ${fontSizes.small};
  background: ${colors.bgDark};
  color: ${colors.textLight};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const CommentButton = styled.button`
  padding: 6px 12px;
  background: ${colors.primary};
  color: ${colors.textLight};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: ${fontSizes.small};

  &:disabled {
    background: ${colors.muted};
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    width: 100%;
  }
`

export const SeeMoreButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primary};
  cursor: pointer;
  margin-bottom: 8px;
  font-size: ${fontSizes.small};

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const CloseButton = styled.button`
  margin-top: 8px;
  background: ${colors.danger};
  color: ${colors.textLight};
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: ${fontSizes.small};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    width: 100%;
  }
`