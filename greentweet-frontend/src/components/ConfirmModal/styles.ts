import styled, { keyframes } from 'styled-components'
import { colors, fontSizes, breakpoints } from '../../styles'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1300;
  animation: ${fadeIn} 0.18s ease-out;
`

export const Dialog = styled.div`
  width: min(420px, 100%);
  border-radius: 12px;
  background: ${colors.bgDark};
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
  padding: 1.75rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${scaleIn} 0.22s ease-out;

  @media (max-width: ${breakpoints.mobile}) {
    padding: 1.5rem 1.25rem 1.25rem;
  }
`

export const Title = styled.h2`
  margin: 0;
  font-size: ${fontSizes.medium};
  color: ${colors.textLight};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.medium};
  }
`

export const Description = styled.p`
  margin: 0;
  font-size: ${fontSizes.small};
  color: ${colors.textMuted};
  line-height: 1.5;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const ErrorMessage = styled.p`
  margin: -0.25rem 0 0;
  font-size: ${fontSizes.small};
  color: ${colors.danger};
`

export const Actions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
`

export const Button = styled.button`
  min-width: 120px;
  border-radius: 999px;
  padding: 0.55rem 1.4rem;
  font-size: ${fontSizes.small};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  border: 1px solid transparent;

  &.cancel {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.25);
    color: ${colors.textMuted};

    &:hover:enabled {
      color: ${colors.textLight};
      border-color: rgba(255, 255, 255, 0.4);
    }
  }

  &.confirm {
    background: ${colors.danger};
    color: ${colors.textLight};
    border-color: ${colors.danger};

    &:hover:enabled {
      filter: brightness(1.05);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex: 1 1 100%;
    min-width: auto;
  }
`
