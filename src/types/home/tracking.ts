export interface TrackingPromptStatusPayload {
  eligible: boolean;
  alreadyViewed: boolean;
  perfectDayCount: number;
  cycleKey: string;
  windowStart: string;
  windowEnd: string;
  message: string;
}

export interface TrackingPromptConfirmRequest {
  cycleKey: string;
}
