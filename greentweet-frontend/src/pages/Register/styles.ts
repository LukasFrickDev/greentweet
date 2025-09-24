import styled from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${colors.bgDark};
  color: ${colors.textLight};
  align-items: center;
  justify-content: center;
  padding: 1rem; /* ajuda no mobile */

  @media (max-width: ${breakpoints.mobile}) {
    height: auto;
    min-height: 100vh;
  }
`

export const FormWrapper = styled.div`
  background: ${colors.bgDark};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 360px;

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    padding: 1.5rem;
  }
`

export const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${colors.primary};
  font-size: ${fontSizes.medium};

  @media (max-width: ${breakpoints.tablet}) {
    font-size: ${fontSizes.tablet.medium};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.medium};
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ hasError }) => (hasError ? '#e74c3c' : '#ccc')};
  font-size: ${fontSizes.small};
  background: ${colors.bgDark};
  color: ${colors.textLight};

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${fontSizes.small};
  color: ${colors.textLight};
  cursor: pointer;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const Button = styled.button`
  padding: 0.75rem;
  background: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: ${fontSizes.small};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`

export const ErrorText = styled.p`
  color: ${colors.danger};
  font-size: 0.85rem;
  margin: -0.5rem 0 0.5rem;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.75rem;
  }
`

export const TextLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: ${fontSizes.small};
  color: ${colors.textMuted};

  & > span {
    color: ${colors.primary};
    cursor: pointer;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
  }
`