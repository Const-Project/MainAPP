import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  likeFeedTarget,
  unlikeFeedTarget,
  type FeedLikeTargetType,
} from "@/apis/feed/likeApi";

type Params = {
  targetId: number;
  targetType: FeedLikeTargetType;
  initialLiked: boolean;
  initialLikeCount: number;
  onSuccessRefetch?: () => void | Promise<unknown>;
};

export default function useFeedLikeToggle({
  targetId,
  targetType,
  initialLiked,
  initialLikeCount,
  onSuccessRefetch,
}: Params) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialLikeCount);
  }, [initialLiked, initialLikeCount]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (liked) {
        await unlikeFeedTarget(targetId, targetType);
        return false;
      }

      await likeFeedTarget(targetId, targetType);
      return true;
    },
    onMutate: () => {
      const nextLiked = !liked;
      const nextLikeCount = Math.max(0, likeCount + (nextLiked ? 1 : -1));

      setLiked(nextLiked);
      setLikeCount(nextLikeCount);

      return { previousLiked: liked, previousLikeCount: likeCount };
    },
    onError: (_error, _variables, context) => {
      if (!context) {
        return;
      }

      setLiked(context.previousLiked);
      setLikeCount(context.previousLikeCount);
    },
    onSuccess: () => {
      void onSuccessRefetch?.();
    },
  });

  return {
    liked,
    likeCount,
    toggleLike: () => {
      if (mutation.isPending) {
        return;
      }

      mutation.mutate();
    },
    isLikePending: mutation.isPending,
  };
}
