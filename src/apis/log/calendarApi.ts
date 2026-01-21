import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GetCalendarResponse } from "@/types/log/calendarApi.type";
import api from "@/apis/instance";

/** GET /api/v1/calendar?m=1&y=2025 */
export const getCalendar = async (
  y: number,
  m: number
): ApiResponse<GetCalendarResponse> => {
  const res = await api.get("/api/v1/calendar", { params: { y, m } });
  return res.data;
};
