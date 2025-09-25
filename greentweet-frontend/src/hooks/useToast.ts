import { useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/toastSlice";

export const useToast = () => {
  const dispatch = useAppDispatch();

  const pushToast = useCallback(
    (message: string, options?: { duration?: number }) => {
      dispatch(showToast(message, options));
    },
    [dispatch]
  );

  return {
    showToast: pushToast,
  };
};
