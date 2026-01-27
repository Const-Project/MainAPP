import { useMutation } from "@tanstack/react-query";

import {
  FinalChoiceAvatarRequest,
  FinalChoiceAvatarResponse,
} from "@/types/avatars/masters";
import { finalChoiceAvatarApi } from "@/apis/avatars/avatarApi";

export const useFinalChoiceAvatar = () => {
  return useMutation<FinalChoiceAvatarResponse, Error, FinalChoiceAvatarRequest>({
    mutationFn: data => finalChoiceAvatarApi(data),
  });
};
