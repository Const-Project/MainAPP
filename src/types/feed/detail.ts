export interface FeedComment {
  commentId: number;
  profileImageUrl: string | null;
  writer: string;
  content: string;
}

export interface FeedDetailResult {
  id: number;
  writerId: number;
  writerName: string;
  profileImageUrl: string | null;
  content: string;
  imageUrl: string;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  comments: FeedComment[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface FeedDetailResponse {
  result: FeedDetailResult;
}
