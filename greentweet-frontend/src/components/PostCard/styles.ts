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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid ${colors.primary};

  @media (max-width: ${breakpoints.mobile}) {
    width: 40px;
    height: 40px;
  }
`

export const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  header {
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;

    .author {
      font-weight: bold;
    }

    .date {
      margin-left: 0.5rem;
      font-size: 0.8rem;
      color: ${colors.textMuted};

      @media (max-width: ${breakpoints.mobile}) {
        font-size: ${fontSizes.mobile.small};
      }
    }
  }

  p {
    margin-bottom: 0.75rem;
    margin-left: 0.5rem;
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
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;

    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    button {
      background: transparent;
      border: none;
      color: ${colors.textMuted};
      cursor: pointer;
      font-size: ${fontSizes.small};
      transition: color 0.2s ease;

      &:hover {
        color: ${colors.primary};
      }

      &.delete {
        color: ${colors.textMuted};

        &:hover {
          color: ${colors.primary};
        }
      }

      @media (max-width: ${breakpoints.mobile}) {
        font-size: ${fontSizes.mobile.small};
      }
    }
  }
`

export const ImageWrapper = styled.div`
  margin-top: 0.5rem;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
`

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`