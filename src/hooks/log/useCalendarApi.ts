import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetCalendarResponse } from "@/types/log/calendarApi.type";
import { getCalendar } from "@/apis/log/calendarApi";

export const useCalendar = (y: number, m: number) =>
  useQuery<{ result: GetCalendarResponse }, unknown, GetCalendarResponse>({
    queryKey: ["calendar", y, m],
    queryFn: () => getCalendar(y, m),
    select: data => data.result,
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
  });

export default useCalendar;
