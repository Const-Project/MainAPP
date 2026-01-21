export type CalendarDay = {
  day: number;
  missionCompleteCount: number; // 0~4 (4 이상은 4로 처리)
};

export type GetCalendarResponse = {
  year: number;
  month: number; // 1~12
  days: CalendarDay[];
};
