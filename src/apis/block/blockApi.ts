import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";

type BlockUserPayload = {
  userIdToBlock: number;
};

export const postBlockUser = async (
  userIdToBlock: number
): ApiResponse<void> => {
  const res = await api.post("/api/v1/blocks", { userIdToBlock } satisfies BlockUserPayload);
  return res.data;
};

export const deleteBlockUser = async (
  userIdToBlock: number
): ApiResponse<void> => {
  const res = await api.delete("/api/v1/blocks", {
    data: { userIdToBlock } satisfies BlockUserPayload,
  });
  return res.data;
};
