import axios from "axios";
import useRegisterApi from "@/hooks/register/useRegisterApi";
import { ErrorResponse } from "@/types/common/apiResponse.type";

// useRegister는 mutateAsync를 감싸서 에러처리 담당

export const useRegister = () => {
  const { postRegisterMutation } = useRegisterApi();

  const register = async (nickname: string) => {
    try {
      await postRegisterMutation.mutateAsync(nickname);
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        throw error.response?.data.code;
      }
      throw error;
    }
  };

  return {
    register,
    postRegisterMutation,
    isLoading: postRegisterMutation.isPending,
  };
};

export default useRegister;
