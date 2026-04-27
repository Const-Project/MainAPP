import { useMutation } from "@tanstack/react-query";
import { loginWithSupabaseApi } from "@/apis/register/registerApi";
import useTokenStore from "@/stores/useTokenStore";
import { PostRegisterResponse } from "@/types/apis/register";
import { GlobalResponse } from "@/types/common/apiResponse.type";

// [STEP 3.5] 커스텀 훅 - 백엔드 로그인 연동 로직
// Supabase OAuth 로그인 후 획득한 토큰을 MainBE 백엔드에 보내고
// 응답으로 받은 자체 JWT 및 UserId를 useTokenStore (Zustand/AsyncStorage)에 영구 저장합니다.
export const useBackendLogin = () => {
  const { setAuth } = useTokenStore();

  return useMutation<GlobalResponse<PostRegisterResponse>, Error, string>({
    mutationFn: (accessToken: string) => loginWithSupabaseApi(accessToken),
    onSuccess: (data) => {
      // 요청이 성공했을 경우 토큰 정보를 상태 및 기기 저장소에 업데이트합니다.
      if (data.isSuccess && data.result) {
        setAuth({
          accessToken: data.result.accessToken,
          refreshToken: data.result.refreshToken,
          userId: String(data.result.userId),
        });
      }
    },
    onError: (error) => {
      console.error("[useBackendLogin] Backend login failed:", error);
    },
  });
};
