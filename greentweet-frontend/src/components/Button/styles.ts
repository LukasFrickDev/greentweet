import { styled } from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'
import { Link } from 'react-router-dom'
import { type Props } from '.'

export const ButtonContainer = styled.button<Props>`
  background-color: ${(props) =>
    props.variant === 'primary' ? colors.primary : 'transparent'};
  color: ${colors.textLight};
  border: 2px solid
    ${(props) =>
      props.variant === 'primary' ? colors.secondary : colors.textLight};
  font-size: ${fontSizes.small};
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    padding: 6px 12px;
  }
`

export const ButtonLink = styled(Link)`
  background-color: transparent;
  color: ${colors.textLight};
  border: 2px solid ${colors.textLight};
  font-size: ${fontSizes.small};
  font-weight: bold;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.primary};
    border-color: ${colors.primary};
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    padding: 6px 12px;
  }
`