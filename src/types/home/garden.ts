export interface Avatar {
  avatarId: number;
  avatarName: string;
  avatarImageUrl: string;
}

export type HomeMissionType = "DIARY" | "QUIZ" | "CHECKING";

export interface GardenSummary {
  gardenId: number;
  gardenSlotNumber: number;
  avatar?: Avatar | null;
  isLocked?: boolean;
  isUnlockable?: boolean;
  locked?: boolean;
  unlockable?: boolean;
  ownerWateringAble: boolean | null;
  ownerSunlightAble: boolean;
}

export interface TodayMission {
  missionId: number;
  missionTitle: string;
  missionType: HomeMissionType | string;
  isCompleted?: boolean;
  completed?: boolean;
}

export interface UserInfo {
  id: number;
  username: string;
  level: number;
  currentExp: number;
  requiredExpForNextLevel: number;
  unreadNotificationCount: number;
  lastAccessedSlotNumber?: number;
}

export interface HomeSummaryPayload {
  userInfo: UserInfo;
  gardenSummaries: GardenSummary[];
  todayMissions: TodayMission[];
}

export const getGardenLocked = (garden: GardenSummary) =>
  garden.isLocked ?? garden.locked ?? false;

export const getGardenUnlockable = (garden: GardenSummary) =>
  garden.isUnlockable ?? garden.unlockable ?? false;

export const getMissionCompleted = (mission: TodayMission) =>
  mission.isCompleted ?? mission.completed ?? false;

export const normalizeHomeSummaryPayload = (
  payload: HomeSummaryPayload
): HomeSummaryPayload => ({
  ...payload,
  gardenSummaries: payload.gardenSummaries.map(garden => ({
    ...garden,
    isLocked: getGardenLocked(garden),
    isUnlockable: getGardenUnlockable(garden),
  })),
  todayMissions: payload.todayMissions.map(mission => ({
    ...mission,
    isCompleted: getMissionCompleted(mission),
  })),
});
