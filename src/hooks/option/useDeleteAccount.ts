import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMeApi } from "@/apis/option/userApi";
import { clearLocalSession } from "@/utils/auth";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeApi,
    onSuccess: async () => {
      await clearLocalSession();
      queryClient.clear();
    },
  });
};
