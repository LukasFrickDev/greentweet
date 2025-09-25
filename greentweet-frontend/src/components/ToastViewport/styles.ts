import styled from "styled-components";
import { breakpoints, colors, fontSizes } from "../../styles";

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
`;

export const ToastMessage = styled.div`
  background: ${colors.primary};
  color: ${colors.textLight};
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: ${fontSizes.small};
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: ${fontSizes.mobile.small};
    text-align: center;
  }
`;
