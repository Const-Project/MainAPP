import axios, {
  AxiosHeaders,
  AxiosError,
  AxiosRequestHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { refreshAuthApi } from "@/apis/register/registerApi";
import useTokenStore from "@/stores/useTokenStore";
import { logout } from "@/utils/auth";

type ReqConfig = InternalAxiosRequestConfig & {
  _skipAuth?: boolean;
  _retry?: boolean;
};

// 환경변수는 app.config.ts 또는 .env에서 설정
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.napulnapul.com";

const api = axios.create({
  baseURL: API_URL,
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const { refreshToken, userId } = useTokenStore.getState();

      if (!refreshToken) {
        return null;
      }

      try {
        const response = await refreshAuthApi(refreshToken);

        if (!response.isSuccess || !response.result?.accessToken) {
          return null;
        }

        useTokenStore.getState().setAuth({
          accessToken: response.result.accessToken,
          refreshToken: response.result.refreshToken || refreshToken,
          userId: response.result.userId
            ? String(response.result.userId)
            : userId,
        });

        return response.result.accessToken;
      } catch (refreshError) {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

/** 요청 인터셉터: accessToken 부착 (옵션으로 스킵 가능) */
api.interceptors.request.use((config: ReqConfig) => {
  if (config._skipAuth) return config;

  const { accessToken } = useTokenStore.getState();
  const headers = (config.headers ??=
    new AxiosHeaders()) as AxiosRequestHeaders;

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete headers.Authorization;
  }

  return config;
});

/** 응답 인터셉터: 401 refresh 1회 재시도, 실패 시 인증 해제 */
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as ReqConfig | undefined;

    if (status === 403) {
      return Promise.reject(error);
    }

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._skipAuth &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const nextAccessToken = await refreshAccessToken();

      if (!nextAccessToken) {
        await logout();
        return Promise.reject(error);
      }

      const headers = (originalRequest.headers ??=
        new AxiosHeaders()) as AxiosRequestHeaders;
      headers.Authorization = `Bearer ${nextAccessToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
