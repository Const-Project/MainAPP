export interface WriteDiaryImageUploadResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    imageId: number;
    imageUrl: string;
  };
}

export interface WriteDiarySubmitRequest {
  title: string;
  content: string;
  imageUrl: string;
  isPublic: boolean;
  imageId: number;
}

export interface WriteDiarySubmitResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    diaryId: number;
    title: string;
    content: string;
    imageUrl: string;
    likeCount: number;
    createdAt: string;
    updatedAt: string;
    public: boolean;
  };
}
