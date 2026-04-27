import { PostRegisterResponse } from "@/types/apis/register";
import { ApiResponse } from "@/types/common/apiResponse.type";
import axios from "@/apis/instance";

export const registerApi = async (
  nickname: string
): ApiResponse<PostRegisterResponse> => {
  return axios.post("/api/v1/auth/signup", { nickname }).then(res => res.data);
};

// [STEP 3] 백엔드 자체 인증 처리 API
// 프론트엔드에서 획득한 Supabase의 AccessToken을 백엔드로 보내어
// 자체 서비스에서 사용하는 JWT(Access/Refresh Token)로 교환받습니다.
export const loginWithSupabaseApi = async (
  accessToken: string
): ApiResponse<PostRegisterResponse> => {
  return axios.post("/api/v1/auth/supabase", { accessToken }).then(res => res.data);
};
