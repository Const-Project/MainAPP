export interface User {
  userId: number;
  username: string;
  userImageUrl: string | null;
}

export interface FollowResponse {
  result: User[];
}
