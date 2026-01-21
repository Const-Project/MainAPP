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
