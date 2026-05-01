export type PostCommentRequest = {
  content: string;
  targetId: number;
  targetType: "DIARY" | "AVATAR_POST";
};

export type PostCommentResponse = {
  id: number;
  commentId?: number;
  writerId: number;
  profileImageUrl?: string | null;
  writer: string;
  content: string;
  targetId: number;
  targetType: "DIARY" | "AVATAR_POST";
  createAt: string;
};
