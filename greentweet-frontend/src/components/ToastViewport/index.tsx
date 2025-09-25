import { memo } from "react";
import { useAppSelector } from "../../store/hooks";
import { selectToasts } from "../../store/slices/toastSlice";
import * as S from "./styles";

const ToastViewportComponent = () => {
  const toasts = useAppSelector(selectToasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <S.ToastContainer>
      {toasts.map((toast) => (
        <S.ToastMessage key={toast.id}>{toast.message}</S.ToastMessage>
      ))}
    </S.ToastContainer>
  );
};

const ToastViewport = memo(ToastViewportComponent);

export default ToastViewport;
