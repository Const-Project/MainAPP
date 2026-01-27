import axios from "@/apis/instance";
import {
  SelectAvatarResponse,
  FinalChoiceAvatarRequest,
  FinalChoiceAvatarResponse,
} from "@/types/avatars/masters";

export const getSelectionAvatarApi = async (): Promise<SelectAvatarResponse> => {
  const response = await axios.get<SelectAvatarResponse>("/api/v1/avatars/masters");
  return response.data;
};

export const finalChoiceAvatarApi = async (
  data: FinalChoiceAvatarRequest
): Promise<FinalChoiceAvatarResponse> => {
  const response = await axios.post<FinalChoiceAvatarResponse>(
    "/api/v1/avatars",
    data
  );
  return response.data;
};
