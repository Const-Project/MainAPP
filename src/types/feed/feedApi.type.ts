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

// Random Feed API types (infinite scroll)
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

export interface RandomFeedRequest {
  excludeDiaryIds: number[];
  excludeAvatarPostIds: number[];
  size: number;
}

export interface RandomFeedResult {
  items: RandomFeedItem[];
  hasMore: boolean;
}

export interface RandomFeedResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: RandomFeedResult;
}
