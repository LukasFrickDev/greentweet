import styled from 'styled-components'
import { colors } from '../../styles'

export const Container = styled.div`
  display: flex;
  height: 100vh;
  background: ${colors.bgDark};
  color: ${colors.textLight};
  align-items: center;
  justify-content: center;
`

export const FormWrapper = styled.div`
  background: ${colors.bgDark};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  width: 360px;
`

export const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${colors.primary};
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
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`

export const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${colors.textLight};
  cursor: pointer;
`

export const Button = styled.button`
  padding: 0.75rem;
  background: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

export const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin: -0.5rem 0 0.5rem;
`

export const TextLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${colors.textMuted};
  & > span {
    color: ${colors.primary};
    cursor: pointer;
  }
`
