import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { store } from "../store";
import { loginSuccess, logout } from "../store/slices/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend URL do .env
});

// Tipo auxiliar para permitir a flag _retry
interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.request.use((config) => {
  const token = store.getState().auth.access;
  if (token) {
    if (!config.headers) {
      config.headers = {} as import("axios").AxiosRequestHeaders;
    }
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = store.getState().auth.refresh;
        if (!refresh) throw new Error("No refresh token");

        const refreshRes = await axios.post<{ access: string }>(
          `${import.meta.env.VITE_API_URL}/auth/refresh/`,
          { refresh }
        );

        const newAccess = refreshRes.data.access;
        store.dispatch(
          loginSuccess({
            user: store.getState().auth.user,
            access: newAccess,
            refresh,
          })
        );

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        } else {
          originalRequest.headers = { Authorization: `Bearer ${newAccess}` };
        }

        return api(originalRequest);
      } catch {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default api;