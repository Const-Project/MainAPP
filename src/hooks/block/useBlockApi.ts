import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBlockUser, postBlockUser } from "@/apis/block/blockApi";

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: number) => postBlockUser(targetUserId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: number) => deleteBlockUser(targetUserId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
