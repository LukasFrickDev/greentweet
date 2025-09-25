import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "../index";
import type { Toast } from "../../types/Toast";

type ToastState = {
  items: Toast[];
};

const initialState: ToastState = {
  items: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Toast>) => {
      state.items.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.items = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;

export const selectToasts = (state: RootState) => state.toast.items;

export const showToast = (
  message: string,
  options: { duration?: number } = {}
) =>
  (dispatch: AppDispatch) => {
    const id = nanoid();
    dispatch(addToast({ id, message }));

    const { duration = 2500 } = options;
    if (duration > 0) {
      setTimeout(() => {
        dispatch(removeToast(id));
      }, duration);
    }
  };

export default toastSlice.reducer;
