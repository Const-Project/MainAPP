import type {
  WriteDiaryImageUploadResponse,
  WriteDiarySubmitRequest,
  WriteDiarySubmitResponse,
} from "@/types/mission/writeDiary";

import api from "@/apis/instance";

// 이미지 전송 API
export const uploadDiaryImageApi = async (
  formData: FormData
): Promise<WriteDiaryImageUploadResponse> => {
  const response = await api.post("/api/v1/diaries/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 일기 작성 API
export const submitDiaryApi = async (
  params: WriteDiarySubmitRequest
): Promise<WriteDiarySubmitResponse> => {
  const response = await api.post("/api/v1/diaries", params);
  return response.data;
};
