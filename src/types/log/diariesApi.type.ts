export type DiaryListItem = {
  diaryId: number;
  title: string;
  content: string;
  imageUrl: string;
  likeCount: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  public: boolean;
};

// GET /api/v1/diaries?year=YYYY&month=MM 의 result 타입 (배열)
export type GetDiariesResponse = DiaryListItem[];
