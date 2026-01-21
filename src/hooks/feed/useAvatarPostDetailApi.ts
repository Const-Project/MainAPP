import { useQuery } from "@tanstack/react-query";

import type { GETAvatarPostDetailResponse } from "@/types/feed/avatarPostDetailApi.type";

import { getAvatarPostDetail } from "@/apis/feed/avatarPostDetailApi";

export const useAvatarPostDetail = (postId: number) =>
  useQuery<
    { result: GETAvatarPostDetailResponse },
    unknown,
    GETAvatarPostDetailResponse
  >({
    queryKey: ["avatar-post-detail", postId],
    queryFn: () => getAvatarPostDetail(postId),
    select: data => data.result,
    enabled: Number.isFinite(postId) && postId > 0,
  });

export default useAvatarPostDetail;
