export interface User {
  userId: number;
  username: string;
  userImageUrl: string;
}

export interface FollowResponse {
  result: User[];
}
