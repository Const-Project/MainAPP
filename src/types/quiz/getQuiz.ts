export interface GetQuizRequest {
  quizType: "OX" | "MULTI_CHOICE" | "CHOICE_WITH_PICTURE";
}

export interface QuizOption {
  optionOrder: number;
  optionText: string;
}

export interface GetQuizResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    quizId: number;
    quizQuestion: string;
    quizType: "OX" | "MULTI_CHOICE" | "CHOICE_WITH_PICTURE";
    answerNumber: number | null;
    answerDescription: string | null;
    isCompleted: boolean;
    quizOptions: QuizOption[] | null;
  };
}
