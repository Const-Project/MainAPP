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
  title?: string;
  content?: string;
  caption?: string;
  imageUrl?: string | null;
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
