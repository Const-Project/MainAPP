import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import useTokenStore from "@/stores/useTokenStore";

type ReqConfig = InternalAxiosRequestConfig & {
  _skipAuth?: boolean;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL

const api = axios.create({
  baseURL: API_URL,
});

/** 요청 인터셉터: accessToken 부착 + 디버그 로그 */
api.interceptors.request.use((config: ReqConfig) => {
  if (__DEV__) {
    console.log(
      `[API] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      config.params ? `params=${JSON.stringify(config.params)}` : "",
      config.data ? `body=${JSON.stringify(config.data)}` : "",
    );
  }

  if (config._skipAuth) return config;

  const { accessToken } = useTokenStore.getState();
  const headers = (config.headers ??= new AxiosHeaders()) as AxiosHeaders;
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return config;
});

/** 응답 인터셉터: 디버그 로그 + 에러 핸들링 */
api.interceptors.response.use(
  res => {
    if (__DEV__) {
      console.log(
        `[API] ← ${res.status} ${res.config.method?.toUpperCase()} ${res.config.url}`,
      );
    }
    return res;
  },
  async (error: AxiosError) => {
    if (__DEV__) {
      console.error(
        `[API] ✗ ${error.response?.status ?? "NETWORK_ERROR"} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.data ?? error.message,
      );
    }

    const status = error.response?.status;

    if (status === 403) {
      return Promise.reject(error);
    }

    if (status === 401) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
