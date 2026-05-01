import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type {
  PostCommentRequest,
  PostCommentResponse,
} from "@/types/comments/commentApi.type";
import type { GETDiaryDetailResponse } from "@/types/log/diaryDetailApi.type";
import type { GETAvatarPostDetailResponse } from "@/types/feed/avatarPostDetailApi.type";
import { deleteComment, postComment } from "@/apis/comments/commentApi";
import useTokenStore from "@/stores/useTokenStore";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";

export type DeleteCommentVariables = {
  commentId: number;
  targetType: "DIARY" | "AVATAR_POST";
  targetId: number;
};

type DetailCache = GlobalResponse<GETDiaryDetailResponse | GETAvatarPostDetailResponse>;

type CommentMutateContext = {
  previous: DetailCache | undefined;
  queryKey: (string | number)[];
};

const getDetailQueryKey = (targetType: "DIARY" | "AVATAR_POST", targetId: number) =>
  targetType === "DIARY"
    ? ["diary-detail", targetId]
    : ["avatar-post-detail", targetId];

const normalizeCreatedComment = (comment: PostCommentResponse) => ({
  commentId: comment.commentId ?? comment.id,
  writerId: comment.writerId,
  profileImageUrl: comment.profileImageUrl ?? null,
  writer: comment.writer,
  content: comment.content,
});

export const usePostComment = (onSuccessRefetch?: () => void) => {
  const queryClient = useQueryClient();
  const { userId } = useTokenStore();
  const { user } = useHomeSummaryStore();

  return useMutation<{ result: PostCommentResponse }, unknown, PostCommentRequest, CommentMutateContext>({
    mutationFn: (body: PostCommentRequest) => postComment(body),
    onMutate: async ({ content, targetType, targetId }) => {
      const queryKey = getDetailQueryKey(targetType, targetId);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<DetailCache>(queryKey);

      // 임시 음수 ID: 서버 응답 후 onSettled 리패치로 실제 ID로 교체됨
      const optimisticComment = {
        commentId: -Date.now(),
        writerId: Number(userId),
        profileImageUrl: null,
        writer: user?.username ?? "",
        content,
      };

      queryClient.setQueryData<DetailCache>(queryKey, old =>
        old
          ? {
              ...old,
              result: {
                ...old.result,
                comments: [...old.result.comments, optimisticComment],
                commentCount: old.result.commentCount + 1,
              },
            }
          : old
      );

      return { previous, queryKey };
    },
    onSuccess: (response, { targetType, targetId }) => {
      const queryKey = getDetailQueryKey(targetType, targetId);
      const createdComment = normalizeCreatedComment(response.result);

      queryClient.setQueryData<DetailCache>(queryKey, old => {
        if (!old) {
          return old;
        }

        const withoutOptimistic = old.result.comments.filter(comment => comment.commentId >= 0);
        const alreadyExists = withoutOptimistic.some(
          comment => comment.commentId === createdComment.commentId
        );

        return {
          ...old,
          result: {
            ...old.result,
            comments: alreadyExists ? withoutOptimistic : [...withoutOptimistic, createdComment],
            commentCount: alreadyExists
              ? old.result.commentCount
              : Math.max(old.result.commentCount, withoutOptimistic.length + 1),
          },
        };
      });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["diaries"] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["random-feed-session"] });
      onSuccessRefetch?.();
    },
  });
};

export const useDeleteComment = (onSuccessRefetch?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<{ result: void }, unknown, DeleteCommentVariables, CommentMutateContext>({
    mutationFn: ({ commentId }) => deleteComment(commentId),
    onMutate: async ({ commentId, targetType, targetId }) => {
      const queryKey = getDetailQueryKey(targetType, targetId);
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<DetailCache>(queryKey);

      queryClient.setQueryData<DetailCache>(queryKey, old =>
        old
          ? {
              ...old,
              result: {
                ...old.result,
                comments: old.result.comments.filter(c => c.commentId !== commentId),
                commentCount: Math.max(0, old.result.commentCount - 1),
              },
            }
          : old
      );

      return { previous, queryKey };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["diaries"] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["random-feed-session"] });
      onSuccessRefetch?.();
    },
  });
};

export default usePostComment;
