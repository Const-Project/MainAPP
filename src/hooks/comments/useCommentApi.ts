import { useMutation } from "@tanstack/react-query";

import type {
  PostCommentRequest,
  PostCommentResponse,
} from "@/types/comments/commentApi.type";

import { postComment } from "@/apis/comments/commentApi";

export const usePostComment = (onSuccessRefetch?: () => void) =>
  useMutation<{ result: PostCommentResponse }, unknown, PostCommentRequest>({
    mutationFn: (body: PostCommentRequest) => postComment(body),
    onSuccess: () => {
      onSuccessRefetch?.();
    },
  });

export default usePostComment;
