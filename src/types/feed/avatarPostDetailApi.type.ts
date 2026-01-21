export type AvatarPostCommentApi = {
  commentId: number;
  profileImageUrl: string | null;
  writer: string;
  content: string;
};

export type GETAvatarPostDetailResponse = {
  id: number;
  writerId: number;
  writerName: string;
  profileImageUrl: string | null;
  content: string;
  imageUrl: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  comments: AvatarPostCommentApi[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
};
