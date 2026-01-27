import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  WriteDiaryImageUploadResponse,
  WriteDiarySubmitRequest,
  WriteDiarySubmitResponse,
} from "@/types/mission/writeDiary";

import { uploadDiaryImageApi, submitDiaryApi } from "@/apis/missions/writeDiaryApi";

export const useWriteDiaryImageUploadApi = () => {
  const queryClient = useQueryClient();

  return useMutation<
    WriteDiaryImageUploadResponse,
    Error,
    { formData: FormData }
  >({
    mutationFn: ({ formData }) => uploadDiaryImageApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
  });
};

export const useWriteDiarySubmitApi = () => {
  const queryClient = useQueryClient();

  return useMutation<WriteDiarySubmitResponse, Error, WriteDiarySubmitRequest>({
    mutationFn: body => submitDiaryApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
  });
};
