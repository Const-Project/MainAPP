export interface WishTree {
  currentStage: string;
  nextStage: string;
  currentPoints: number;
  requiredPointsForNextStage: number;
  progressPercent: number;
}

export interface MissionStatus {
  isDairyCompleted: boolean;
  isCheckingCompleted: boolean;
  isQuizCompleted: boolean;
  wishTree: WishTree;
}
