import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

type ReqConfig = InternalAxiosRequestConfig & {
  _skipAuth?: boolean;
};

// 환경변수는 app.config.ts 또는 .env에서 설정
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.napulnapul.com";

const api = axios.create({
  baseURL: API_URL,
});

/** 요청 인터셉터: accessToken 부착 (옵션으로 스킵 가능) */
api.interceptors.request.use((config: ReqConfig) => {
  if (config._skipAuth) return config;

  // TODO: 토큰 스토어 마이그레이션 후 활성화
  // const { accessToken } = useTokenStore.getState();
  // const headers = (config.headers ??=
  //   new AxiosHeaders()) as AxiosRequestHeaders;
  // if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  // else delete headers.Authorization;

  return config;
});

/** 응답 인터셉터: 403 → onboarding 이동, 401 → 토큰 클리어 */
api.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 403) {
      // React Navigation으로 온보딩 화면으로 이동
      // router.replace("/onboarding");
      return Promise.reject(error);
    }

    if (status === 401) {
      // TODO: 토큰 스토어 마이그레이션 후 활성화
      // const store = useTokenStore.getState();
      // store.clearTokens?.();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
