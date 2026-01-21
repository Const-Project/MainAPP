export interface Avatar {
  avatarId: number;
  avatarName: string;
  avatarImageUrl: string;
}

export interface GardenSummary {
  gardenId: number;
  gardenSlotNumber: number;
  avatar?: Avatar | null;
  locked: boolean;
  unlockable: boolean;
  ownerWateringAble: boolean | null;
  ownerSunlightAble: boolean;
}

export interface TodayMission {
  missionId: number;
  missionTitle: string;
  missionType: string;
  completed: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  level: number;
  currentExp: number;
  requiredExpForNextLevel: number;
  unreadNotificationCount: number;
}

export interface HomeSummaryPayload {
  userInfo: UserInfo;
  gardenSummaries: GardenSummary[];
  todayMissions: TodayMission[];
}
