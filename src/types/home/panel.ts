export interface HomePanelWishTree {
  currentStage: string;
  nextStage: string;
  currentPoints: number;
  requiredPointsForNextStage: number;
  progressPercent: number;
}

export interface HomePanelPayload {
  isDairyCompleted: boolean;
  isCheckingCompleted: boolean;
  isQuizCompleted: boolean;
  isQuizResultAvailable?: boolean;
  wishTree: HomePanelWishTree;
}
