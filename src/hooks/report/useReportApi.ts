import { useMutation } from "@tanstack/react-query";
import { postReport } from "@/apis/report/reportApi";
import type { CreateReportPayload } from "@/types/report";

export const useCreateReport = () =>
  useMutation({
    mutationFn: (payload: CreateReportPayload) => postReport(payload),
  });

export default useCreateReport;
