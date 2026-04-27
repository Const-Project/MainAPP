export type AvatarInfo = {
  avatarId: number;
  avatarName: string;
  avatarImageUrl: string;
};

export type GardenInfo = {
  gardenId: number;
  avatarInfo: AvatarInfo | null;
  isWateringAbleByMe: boolean;
};

export enum FollowStatus {
  NOT_FOLLOWING = "NOT_FOLLOWING",
  FOLLOWING = "FOLLOWING",
  FOLLOW_BACK_POSSIBLE = "FOLLOW_BACK_POSSIBLE",
}

export type GetUserProfileResponse = {
  id: number;
  userNickname: string;
  profileImageUrl: string | null;
  followStatus: FollowStatus;
  leftWaterCountForOthers: number;
  userGardens: GardenInfo[];
};

export type FriendWaterResponse = string;
export type FollowUserResponse = string;
