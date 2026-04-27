import { useMutation } from "@tanstack/react-query";
import useTokenStore from "@/stores/useTokenStore";
import { PostRegisterResponse } from "@/types/apis/register";
import { GlobalResponse } from "@/types/common/apiResponse.type";
import { registerApi } from "@/apis/register/registerApi";

// useRegisterApi는 TanStack Query의 useMutation을 정의해서 반환

export const useRegisterApi = () => {
  const { setAuth } = useTokenStore();

  const postRegisterMutation = useMutation<
    GlobalResponse<PostRegisterResponse>,
    unknown,
    string
  >({
    mutationFn: (nickname: string) => registerApi(nickname),
    onSuccess: res => {
      setAuth({
        accessToken: res.result.accessToken,
        refreshToken: res.result.refreshToken,
        userId: String(res.result.userId),
      });
    },
  });

  return { postRegisterMutation };
};

export default useRegisterApi;
