export interface AnswerQuizRequest {
  selectedOptionOrder: number;
}

export interface AnswerQuizResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    quizQuestion: string;
    quizType: "OX" | "MULTI_CHOICE";
    selectedOptionNumber: number;
    answerNumber: number;
    answerDescription: string;
    isCorrect: boolean;
    isCompleted: boolean;
  };
}
