import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  answerDailySurveyApi,
  answerQuizApi,
  getDailySurveyApi,
  getQuizApi,
  uploadDiaryImageApi,
  writeDiaryApi,
} from "@/apis/missions/missionApi";
import type {
  AnswerDailySurveyRequest,
  AnswerDailySurveyResponse,
  AnswerQuizRequest,
  AnswerQuizResponse,
  DailySurvey,
  DiaryImageUploadResponse,
  GetDailySurveyResponse,
  GetQuizRequest,
  GetQuizResponse,
  MissionQuiz,
  WriteDiaryRequest,
  WriteDiaryResponse,
} from "@/types/missions";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { HomePanelPayload } from "@/types/home/panel";
import { createTimingLogger, debugLog } from "@/utils/debug";

export const useWriteDiaryImageUpload = () =>
  useMutation<DiaryImageUploadResponse, Error, FormData>({
    mutationFn: formData => uploadDiaryImageApi(formData),
  });

export const useWriteDiarySubmit = () =>
  useMutation<WriteDiaryResponse, Error, WriteDiaryRequest>({
    mutationFn: payload => writeDiaryApi(payload),
  });

export const useMissionQuiz = (params: GetQuizRequest) =>
  useQuery<GetQuizResponse, Error, MissionQuiz>({
    queryKey: ["mission-quiz", params.quizType],
    queryFn: () => getQuizApi(params),
    select: data => data.result,
  });

export const useAnswerQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AnswerQuizResponse,
    Error,
    AnswerQuizRequest,
    { previous: GlobalResponse<HomePanelPayload> | undefined }
  >({
    mutationFn: payload => answerQuizApi(payload),
    onMutate: async () => {
      /*
       * 한글 주석:
       * 퀴즈 정답 제출 즉시 홈 패널 캐시의 isQuizCompleted를 true로 설정해
       * 홈으로 돌아왔을 때 완료 애니메이션이 지연 없이 표시된다.
       */
      await queryClient.cancelQueries({ queryKey: ["home-panel"] });
      const previous = queryClient.getQueryData<GlobalResponse<HomePanelPayload>>(["home-panel"]);
      queryClient.setQueryData<GlobalResponse<HomePanelPayload>>(["home-panel"], old =>
        old ? { ...old, result: { ...old.result, isQuizCompleted: true } } : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["home-panel"], context.previous);
      }
    },
    onSuccess: async () => {
      /*
       * 한글 주석:
       * 퀴즈 완료 직후 홈 미션 패널과 홈 요약을 함께 갱신해야
       * 사용자가 홈으로 돌아왔을 때 완료 상태가 즉시 반영된다.
       */
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["home-panel"] });
      await queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" });
      await queryClient.refetchQueries({ queryKey: ["home-panel"], type: "all" });
    },
  });
};

export const useDailySurvey = () =>
  useQuery<GetDailySurveyResponse, Error, DailySurvey>({
    queryKey: ["daily-survey"],
    queryFn: getDailySurveyApi,
    select: data => data.result,
    // 한글 주석:
    // 감정 설문은 하루 1회만 바뀌므로 5분간 캐시 유지.
    // 홈 재진입 시 불필요한 재요청 없이 즉시 감정 버튼 상태 표시.
    staleTime: 5 * 60_000,
  });

export const useAnswerDailySurvey = () => {
  const queryClient = useQueryClient();

  return useMutation<AnswerDailySurveyResponse, Error, AnswerDailySurveyRequest>({
    mutationFn: payload => answerDailySurveyApi(payload),
    onSuccess: () => {
      /*
       * Keep the survey modal responsive.
       * Refresh related queries in the background after submit succeeds.
       */
      const finishRefreshTiming = createTimingLogger(
        "useAnswerDailySurvey",
        "post-submit background refresh"
      );

      void Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["daily-survey"] }),
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["home-panel"] }),
        queryClient.refetchQueries({ queryKey: ["daily-survey"], type: "all" }),
        queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" }),
        queryClient.refetchQueries({ queryKey: ["home-panel"], type: "all" }),
      ]).then(results => {
        const rejectedCount = results.filter(result => result.status === "rejected").length;

        finishRefreshTiming({ rejectedCount });

        if (rejectedCount > 0) {
          debugLog("useAnswerDailySurvey", "background refresh had failures", { results });
        }
      });
    },
  });
};

