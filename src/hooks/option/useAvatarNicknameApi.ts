import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatarNickname, type UpdateAvatarPayload } from "@/apis/option/avatarApi";

export const useUpdateAvatarNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAvatarPayload) => updateAvatarNickname(payload),
    onSuccess: async () => {
      // 한글 주석:
      // 아바타 닉네임은 홈, 프로필, 피드에 동시에 노출되므로
      // 저장 직후 관련 캐시를 함께 갱신해 같은 식물이 다른 이름으로 남지 않게 맞춘다.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["feed-detail"] }),
      ]);
    },
  });
};
