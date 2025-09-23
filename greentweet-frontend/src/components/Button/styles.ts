import { styled } from 'styled-components'
import { colors } from '../../styles'
import { Link } from 'react-router-dom'
import { Props } from '.'

export const ButtonContainer = styled.button<Props>`
  background-color: ${(props) =>
    props.variant === 'primary' ? colors.primary : 'transparent'};
  color: ${colors.textLight};
  border: 2px solid
    ${(props) =>
      props.variant === 'primary' ? colors.secondary : colors.textLight};
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
`

export const ButtonLink = styled(Link)`
  background-color: transparent;
  color: ${colors.textLight};
  border: 2px solid ${colors.textLight};
  font-size: 16px;
  font-weight: bold;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 8px;
`
