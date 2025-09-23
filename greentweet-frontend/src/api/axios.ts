import axios, { AxiosError } from "axios";
import { store } from "../store";
import { loginSuccess, logout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.access;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        const refresh = store.getState().auth.refresh;
        if (!refresh) throw new Error("No refresh token");

        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh/`,
          { refresh }
        );

        const newAccess = (refreshRes.data as any).access;
        store.dispatch(
          loginSuccess({
            user: store.getState().auth.user,
            access: newAccess,
            refresh,
          })
        );

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default api;