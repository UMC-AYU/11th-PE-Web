const BACKEND_BASE_URL = "http://localhost:8080";

export interface CheckResult {
  status: number;
  available?: boolean;
  error?: string;
}

export interface RatingItem {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingsResult {
  status: number;
  data?: RatingItem[];
  error?: string;
}

// 1. 닉네임 중복 체크 API
export async function checkNickname(nickname: string): Promise<CheckResult> {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/members/nickname/${encodeURIComponent(nickname)}`,
    );
    const status = res.status;
    if (!res.ok) {
      return { status, error: "서버 응답 오류" };
    }
    const data = await res.json();
    return { status, available: data.available };
  } catch {
    return { status: 0, error: "서버 연결 실패" };
  }
}

// 2. 이메일 중복 체크 API
export async function checkEmail(email: string): Promise<CheckResult> {
  try {
    const res = await fetch(
      `${BACKEND_BASE_URL}/members/email/${encodeURIComponent(email)}`,
    );
    const status = res.status;
    if (!res.ok) {
      return { status, error: "서버 응답 오류" };
    }
    const data = await res.json();
    return { status, available: data.available };
  } catch {
    return { status: 0, error: "서버 연결 실패" };
  }
}

// 3. 유저별 평점 목록 조회 API
export async function getMemberRatings(
  memberId: number,
): Promise<RatingsResult> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/members/${memberId}/ratings`);
    const status = res.status;
    if (!res.ok) {
      return {
        status,
        data: [],
        error: status === 404 ? "존재하지 않는 유저입니다." : "조회 실패",
      };
    }
    const data = await res.json();
    return { status, data };
  } catch {
    return { status: 0, data: [], error: "서버 연결 실패" };
  }
}
