export type GlobalResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

// 응답 Response Type
export type ApiResponse<T> = Promise<GlobalResponse<T>>;

// 응답 데이터가 없는 경우 (ex. delete)
export type NoResponse = Record<string, never>;

// 에러 응답
export type ErrorResponse = GlobalResponse<Record<string, never>>;
