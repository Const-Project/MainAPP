export type DiaryCommentApi = {
  commentId: number;
  profileImageUrl: string | null;
  writer: string;
  content: string;
};

export type GETDiaryDetailResponse = {
  id: number;
  writerId: number;
  writerName: string;
  profileImageUrl: string | null;
  title: string;
  content: string;
  imageUrl: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  comments: DiaryCommentApi[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
};
