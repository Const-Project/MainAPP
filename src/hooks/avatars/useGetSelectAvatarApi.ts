import { useQuery } from "@tanstack/react-query";

import { SelectAvatarResponse } from "@/types/avatars/masters";
import { getSelectionAvatarApi } from "@/apis/avatars/avatarApi";

export const useGetSelectAvatar = () => {
  return useQuery<SelectAvatarResponse, Error>({
    queryKey: ["selectionAvatar"],
    queryFn: getSelectionAvatarApi,
  });
};
