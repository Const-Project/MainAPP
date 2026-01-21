import { PostRegisterResponse } from "@/types/apis/register";
import { ApiResponse } from "@/types/common/apiResponse.type";
import axios from "@/apis/instance";

export const registerApi = async (
  nickname: string
): ApiResponse<PostRegisterResponse> => {
  return axios.post("/api/v1/auth/signup", { nickname }).then(res => res.data);
};
