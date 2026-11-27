// POST /members 요청 본문
export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

// POST /members 응답의 result (비밀번호는 오지 않아요)
export type SignupResult = {
  memberId: number;
  email: string;
  nickname: string;
};

// GET /members/email/{email} 응답의 result
export type EmailAvailability = {
  email: string;
  available: boolean;
};

// GET /members/nickname/{nickname} 응답의 result
export type NicknameAvailability = {
  nickname: string;
  available: boolean;
};

export type MemberRating = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

// GET /members/{memberId}/ratings 응답의 result
export type MemberRatings = {
  memberId: number;
  nickname: string;
  ratingCount: number;
  ratings: MemberRating[];
};

// POST /auth/login 요청 본문
export type LoginRequest = {
  email: string;
  password: string;
};

// POST /auth/login 응답의 result
export type LoginResult = {
  nickname: string;
  accessToken: string;
};

// GET /members/me, PATCH /members/me 응답의 result
export type Me = {
  email: string;
  nickname: string;
  createdAt: string;
};

// PATCH /members/me 요청 본문
export type UpdateMeRequest = {
  nickname: string;
};
