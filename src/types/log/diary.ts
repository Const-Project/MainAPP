export interface DiaryItem {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  public: boolean;
}

export interface DiaryResponse {
  data: DiaryItem[];
}

// 댓글 타입
export interface CommentItem {
  id: number;
  profileImageUrl: string | null;
  writer: string;
  content: string;
}

// 일기 상세 조회 응답 타입
export interface DiaryDetailResponse {
  data: {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    likeCount: number;
    commentCount: number;
    comment: CommentItem[];
    createdAt: string;
    updatedAt: string;
    public: boolean;
  };
}
