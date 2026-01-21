import type {
  PostCommentRequest,
  PostCommentResponse,
} from "@/types/comments/commentApi.type";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import api from "@/apis/instance";

export const postComment = async (
  body: PostCommentRequest
): ApiResponse<PostCommentResponse> => {
  const res = await api.post("/api/v1/comments", body);
  return res.data;
};
