export type ReportTargetType = "DIARY" | "COMMENT" | "AVATAR_POST" | "USER";

export type CreateReportPayload = {
  targetType: ReportTargetType;
  targetId: number;
  reason: string;
  additionalComment?: string;
};
