import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../types/Auth";


interface AuthState {
  user: AuthUser | null;
  access: string | null;
  refresh: string | null;
}

const initialState: AuthState = {
  user: null,
  access: localStorage.getItem("access"),
  refresh: localStorage.getItem("refresh"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: AuthUser | null; access: string; refresh: string }>
    ) => {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      localStorage.setItem("access", state.access);
      localStorage.setItem("refresh", state.refresh);
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
