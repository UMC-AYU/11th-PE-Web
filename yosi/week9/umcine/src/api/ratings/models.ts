// POST /ratings 요청 본문 (memberId는 토큰이 알려주니까 보내지 않아요)
export type CreateRatingRequest = {
  movieId: number;
  score: number;
  comment?: string | null;
};

// PATCH /ratings/{ratingId} 요청 본문 (보낸 값만 바뀌어요. comment에 null을 보내면 지워져요)
export type UpdateRatingRequest = {
  score?: number;
  comment?: string | null;
};

// 평점 등록·수정 응답의 result
export type Rating = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};
