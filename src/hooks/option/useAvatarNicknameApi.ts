import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatarNickname, type UpdateAvatarPayload } from "@/apis/option/avatarApi";

export const useUpdateAvatarNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAvatarPayload) => updateAvatarNickname(payload),
    onSuccess: () => {
      // 한글 주석:
      // 아바타 닉네임은 홈, 프로필, 피드에 동시에 노출되므로
      // 저장 직후 관련 캐시 갱신은 백그라운드로 넘겨 변경 완료 화면을 막지 않는다.
      void Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["feed-detail"] }),
      ]);
    },
  });
};
