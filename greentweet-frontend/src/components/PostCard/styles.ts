import styled from 'styled-components'
import { colors } from '../../styles'

export const Card = styled.div`
  background: ${colors.bgDark};
  border: 1px solid ${colors.textMuted};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
`

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`

export const Body = styled.div`
  flex: 1;

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
    }
  }

  p {
    margin-bottom: 0.5rem;
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
      &:hover {
        color: ${colors.primary};
      }
    }
  }
`

export const Image = styled.img`
  margin-top: 0.5rem;
  max-width: 100%;
  border-radius: 8px;
`