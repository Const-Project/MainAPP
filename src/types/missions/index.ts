export type MissionQuizType = "MULTI_CHOICE" | "OX";
export type SurveyAnswerKind = "YES" | "NEUTRAL" | "NO";
export type SurveyAnswerValue = 1 | 2 | 3;

export const SURVEY_ANSWER_VALUE_MAP: Record<SurveyAnswerKind, SurveyAnswerValue> = {
  YES: 1,
  NEUTRAL: 2,
  NO: 3,
};

export interface DiaryImageUploadResult {
  imageId: number;
  imageUrl: string;
}

export interface DiaryImageUploadResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: DiaryImageUploadResult;
}

export interface WriteDiaryRequest {
  title: string;
  content: string;
  isPublic: boolean;
  imageId: number;
}

export interface WriteDiaryResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    diaryId: number;
    title: string;
    content: string;
    imageUrl: string | null;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    public: boolean;
  };
}

export interface TodayKeyword {
  keyword: string;
}

export interface GetTodayKeywordResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TodayKeyword;
}

export interface QuizOption {
  optionOrder: number;
  optionText: string;
}

export interface MissionQuiz {
  quizId: number;
  quizQuestion: string;
  quizType: MissionQuizType;
  quizOptions?: QuizOption[] | null;
  isCompleted?: boolean;
  selectedOptionNumber?: number | null;
  answerNumber?: number | null;
  isCorrect?: boolean | null;
  answerDescription?: string | null;
}

export interface GetQuizRequest {
  quizType: MissionQuizType;
}

export interface GetQuizResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MissionQuiz;
}

export interface AnswerQuizRequest {
  quizId: number;
  selectedOptionOrder: number;
}

export interface AnswerQuizResult {
  isCorrect: boolean;
  answerDescription: string;
  answerNumber: number;
  isCompleted: boolean;
  selectedOptionNumber: number;
  quizQuestion: string;
  quizType: MissionQuizType;
}

export interface AnswerQuizResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: AnswerQuizResult;
}

export interface DailySurvey {
  id: number;
  question: string;
  isAnswered: boolean;
}

export interface GetDailySurveyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: DailySurvey;
}

export interface AnswerDailySurveyRequest {
  questionId: number;
  answer: SurveyAnswerValue;
}

export interface AnswerDailySurveyResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: null;
}
