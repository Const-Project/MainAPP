export type PostType = "DIARY" | "AVATAR_POST";

export interface FeedPost {
  postId: number;
  postType: PostType;
  imageUrl: string;
}

export interface FeedResponse {
  result: FeedPost[];
}

export type GetFeedResponse = FeedPost[];

// Random Feed API types (session-based infinite scroll)
export interface FeedAuthor {
  userId: number;
  username: string;
  profileImageUrl: string;
}

export interface RandomFeedItem {
  postId: number;
  postType: PostType;
  imageUrl?: string;
  author: FeedAuthor;
  commentCount: number;
  likeCount: number;
  createdAt: string;
}

// Session start request/response
export interface RandomFeedSessionRequest {
  size: number;
}

export interface RandomFeedSessionResult {
  sessionToken: string;
  items: RandomFeedItem[];
  hasMore: boolean;
  remaining: number;
}

export interface RandomFeedSessionResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RandomFeedSessionResult;
}

// Next page request/response
export interface RandomFeedNextRequest {
  sessionToken: string;
  size: number;
}

export interface RandomFeedNextResult {
  items: RandomFeedItem[];
  hasMore: boolean;
  remaining: number;
}

export interface RandomFeedNextResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RandomFeedNextResult;
}
