import styled from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const Card = styled.div`
  background: ${colors.bgDark};
  border: 1px solid ${colors.textMuted};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: ${breakpoints.mobile}) {
    width: 40px;
    height: 40px;
  }
`

export const Body = styled.div`
  flex: 1;

  .author {
    color: ${colors.primary};
    font-weight: bold;
    text-decoration: none;
    cursor: pointer;
    font-size: ${fontSizes.small};

    &:hover {
      text-decoration: underline;
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .author {
      font-weight: bold;
    }

    .date {
      font-size: 0.8rem;
      color: ${colors.textMuted};

      @media (max-width: ${breakpoints.mobile}) {
        font-size: 0.7rem;
      }
    }
  }

  p {
    margin-bottom: 0.5rem;
    font-size: ${fontSizes.small};

    @media (max-width: ${breakpoints.tablet}) {
      font-size: ${fontSizes.tablet.small};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${fontSizes.mobile.small};
    }
  }

  footer {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;

    button {
      background: transparent;
      border: none;
      color: ${colors.textMuted};
      cursor: pointer;
      font-size: ${fontSizes.small};

      &:hover {
        color: ${colors.primary};
      }

      @media (max-width: ${breakpoints.mobile}) {
        font-size: ${fontSizes.mobile.small};
      }
    }
  }
`

export const Image = styled.img`
  margin-top: 0.5rem;
  max-width: 100%;
  border-radius: 8px;
`