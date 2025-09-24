import styled from 'styled-components'
import { colors } from '../../styles'
import { breakpoints } from '../../styles'
import { fontSizes } from '../../styles'

export const ToastContainer = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 9999;

  @media (max-width: ${breakpoints.mobile}) {
    right: 50%;
    transform: translateX(50%);
    bottom: 8px;
    width: 90%;
  }
`

export const ToastMessage = styled.div`
  background:  '#2e7d32';
  color: ${colors.textLight};
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-family: sans-serif;
  font-size: ${fontSizes.small};

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    text-align: center;
  }
`