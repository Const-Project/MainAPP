export type RandomFeedPostType = "DIARY" | "AVATAR_POST";

export interface RandomFeedAuthor {
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

export interface RandomFeedSessionItem {
  postId: number;
  postType: RandomFeedPostType;
  author: RandomFeedAuthor;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface RandomFeedSessionPayload {
  sessionToken: string;
  items: RandomFeedSessionItem[];
  hasMore: boolean;
  remaining: number;
}

export interface RandomFeedSessionStartRequest {
  size: number;
}

export interface RandomFeedSessionNextRequest {
  sessionToken: string;
  size: number;
}
