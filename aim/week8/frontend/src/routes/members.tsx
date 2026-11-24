import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/members")({
  component: MembersPage,
});

type AvailabilityResponse = {
  available: boolean;
};

type RatingResponse = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = "http://localhost:8080";

function MembersPage() {
  // 닉네임 입력값, 결과 문구, 요청 중 여부
  const [nickname, setNickname] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [checkingNickname, setCheckingNickname] = useState(false);

  // 이메일 입력값, 결과 문구, 요청 중 여부
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  // 회원 ID, 평점 목록, 결과 문구, 요청 중 여부
  const [memberId, setMemberId] = useState("");
  const [ratings, setRatings] = useState<RatingResponse[] | null>(null);
  const [ratingsMessage, setRatingsMessage] = useState("");
  const [loadingRatings, setLoadingRatings] = useState(false);

  async function checkNickname() {
    const value = nickname.trim();

    if (!value) {
      setNicknameMessage("닉네임을 입력해 주세요.");
      return;
    }

    setCheckingNickname(true);
    setNicknameMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/members/nickname/${encodeURIComponent(value)}`,
      );

      if (!response.ok) {
        throw new Error(`닉네임 확인 실패: HTTP ${response.status}`);
      }

      const data: AvailabilityResponse = await response.json();

      setNicknameMessage(
        data.available
          ? "사용 가능한 닉네임입니다."
          : "이미 사용 중인 닉네임입니다.",
      );
    } catch (error) {
      console.error("닉네임 중복 확인 요청 오류:", error);
      setNicknameMessage("닉네임을 확인하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setCheckingNickname(false);
    }
  }

  async function checkEmail() {
    const value = email.trim();

    if (!value) {
      setEmailMessage("이메일을 입력해 주세요.");
      return;
    }

    setCheckingEmail(true);
    setEmailMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/members/email/${encodeURIComponent(value)}`,
      );

      if (!response.ok) {
        throw new Error(`이메일 확인 실패: HTTP ${response.status}`);
      }

      const data: AvailabilityResponse = await response.json();

      setEmailMessage(
        data.available
          ? "사용 가능한 이메일입니다."
          : "이미 사용 중인 이메일입니다.",
      );
    } catch (error) {
      console.error("이메일 중복 확인 요청 오류:", error);
      setEmailMessage("이메일을 확인하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setCheckingEmail(false);
    }
  }

  async function getMemberRatings() {
    const value = memberId.trim();

    setRatings(null);
    setRatingsMessage("");

    // 회원 ID는 1 이상의 정수만 허용
    if (!/^[1-9]\d*$/.test(value)) {
      setRatingsMessage("회원 ID는 1 이상의 정수로 입력해 주세요.");
      return;
    }

    setLoadingRatings(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/members/${value}/ratings`,
      );

      if (!response.ok) {
        throw new Error(`평점 조회 실패: HTTP ${response.status}`);
      }

      const data: RatingResponse[] = await response.json();
      setRatings(data);
    } catch (error) {
      console.error("회원별 평점 조회 요청 오류:", error);
      setRatingsMessage("평점을 불러오지 못했어요. 다시 시도해 주세요.");
    } finally {
      setLoadingRatings(false);
    }
  }

  return (
    <main className="mx-auto max-w-[1000px] px-5 py-10">
      <h1 className="mb-8 text-3xl font-bold">회원 기능</h1>

      <div className="space-y-6">
        {/* 닉네임 중복 확인 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            닉네임 중복 확인
          </h2>

          <label htmlFor="nickname" className="mb-2 block text-sm">
            닉네임
          </label>

          <div className="flex flex-wrap gap-3">
            <input
              id="nickname"
              type="text"
              value={nickname}
              disabled={checkingNickname}
              onChange={(event) => {
                setNickname(event.target.value);
                setNicknameMessage("");
              }}
              placeholder="닉네임을 입력하세요"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />

            <button
              type="button"
              onClick={checkNickname}
              disabled={checkingNickname}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {checkingNickname ? "확인 중…" : "중복 확인"}
            </button>
          </div>

          <p role="status" className="mt-3 text-sm">
            {nicknameMessage}
          </p>
        </section>

        {/* 이메일 중복 확인 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            이메일 중복 확인
          </h2>

          <label htmlFor="email" className="mb-2 block text-sm">
            이메일
          </label>

          <div className="flex flex-wrap gap-3">
            <input
              id="email"
              type="email"
              value={email}
              disabled={checkingEmail}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailMessage("");
              }}
              placeholder="이메일을 입력하세요"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />

            <button
              type="button"
              onClick={checkEmail}
              disabled={checkingEmail}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {checkingEmail ? "확인 중…" : "중복 확인"}
            </button>
          </div>

          <p role="status" className="mt-3 text-sm">
            {emailMessage}
          </p>
        </section>

        {/* 회원별 평점 조회 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">
            회원별 평점 조회
          </h2>

          <label htmlFor="memberId" className="mb-2 block text-sm">
            회원 ID
          </label>

          <div className="flex flex-wrap gap-3">
            <input
              id="memberId"
              type="text"
              inputMode="numeric"
              value={memberId}
              disabled={loadingRatings}
              onChange={(event) => {
                setMemberId(event.target.value);
                setRatings(null);
                setRatingsMessage("");
              }}
              placeholder="예: 1"
              className="rounded-lg border border-gray-300 px-3 py-2"
            />

            <button
              type="button"
              onClick={getMemberRatings}
              disabled={loadingRatings}
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {loadingRatings ? "조회 중…" : "평점 조회"}
            </button>
          </div>

          <p role="status" className="mt-3 text-sm">
            {ratingsMessage}
          </p>

          {ratings !== null && (
            <div className="mt-4">
              <p role="status" className="mb-3 text-sm">
                조회된 평점: {ratings.length}개
              </p>

              {ratings.length === 0 ? (
                <p>등록된 평점이 없습니다.</p>
              ) : (
                <ul className="space-y-3">
                  {ratings.map((rating) => (
                    <li
                      key={rating.ratingId}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <p className="font-semibold">
                        영화 번호: {rating.movieId}
                      </p>

                      <p className="mt-1">
                        별점: {rating.score} / 5
                      </p>

                      <p className="mt-2 whitespace-pre-wrap break-words">
                        {rating.comment?.trim() ||
                          "작성된 코멘트가 없습니다."}
                      </p>

                      <p className="mt-3 text-xs text-gray-500">
                        작성 시간: {rating.createdAt.replace("T", " ")}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        수정 시간: {rating.updatedAt.replace("T", " ")}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}