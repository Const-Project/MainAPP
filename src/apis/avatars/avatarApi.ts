import api from "@/apis/instance";
import type {
  FinalChoiceAvatarRequest,
  FinalChoiceAvatarResponse,
  SelectAvatarResponse,
  UploadCreationAvatarResponse,
} from "@/types/avatars";

export const getAvatarMastersApi = async (): Promise<SelectAvatarResponse> => {
  const res = await api.get("/api/v1/avatars/masters");
  return res.data;
};

export const postUploadCreationAvatarApi = async (
  formData: FormData
): Promise<UploadCreationAvatarResponse> => {
  const res = await api.post("/api/v1/register/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const postFinalChoiceAvatarApi = async (
  payload: FinalChoiceAvatarRequest
): Promise<FinalChoiceAvatarResponse> => {
  const res = await api.post("/api/v1/avatars", payload);
  return res.data;
};
