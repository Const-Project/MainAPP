import axios from "axios";
import { PostRegisterResponse } from "@/types/apis/register";
import { ApiResponse } from "@/types/common/apiResponse.type";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.napulnapul.com";

const refreshClient = axios.create({
  baseURL: API_URL,
});

export const refreshAuthApi = async (
  refreshToken: string
): ApiResponse<PostRegisterResponse> => {
  return refreshClient
    .post("/api/v1/auth/refresh", { refreshToken })
    .then(res => res.data);
};
