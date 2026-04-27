import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    _skipAuth?: boolean;
    _retry?: boolean;
  }

  interface InternalAxiosRequestConfig {
    _skipAuth?: boolean;
    _retry?: boolean;
  }
}
