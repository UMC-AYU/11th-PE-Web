// src/components/backend-test.tsx
import { useState } from "react";
import {
  checkNickname,
  checkEmail,
  getMemberRatings,
  RatingResponse,
} from "../api/backend";

export function BackendTest() {
  const [nicknameResult, setNicknameResult] = useState<string>("-");
  const [emailResult, setEmailResult] = useState<string>("-");
  const [ratings, setRatings] = useState<RatingResponse[]>([]);

  const handleNicknameCheck = async () => {
    try {
      const res = await checkNickname("수현");
      setNicknameResult(res.available ? "사용 가능 (true)" : "중복됨 (false)");
    } catch {
      setNicknameResult("요청 에러");
    }
  };

  const handleEmailCheck = async () => {
    try {
      const res = await checkEmail("noco@umc.com");
      setEmailResult(res.available ? "사용 가능 (true)" : "중복됨 (false)");
    } catch {
      setEmailResult("요청 에러");
    }
  };

  const handleFetchRatings = async () => {
    try {
      const data = await getMemberRatings(1);
      setRatings(data);
    } catch {
      alert("평점 조회 실패");
    }
  };

  return (
    <section
      style={{
        margin: "30px 0",
        padding: "20px",
        border: "2px dashed var(--accent)",
        borderRadius: "12px",
        textAlign: "left",
        background: "var(--code-bg)",
      }}
    >
      <h2 style={{ marginTop: 0 }}>🔌 5주차 백엔드 API 연동 검증</h2>

      <div style={{ marginBottom: "15px" }}>
        <button
          type="button"
          onClick={handleNicknameCheck}
          style={{ marginRight: "10px", padding: "6px 12px" }}
        >
          '수현' 닉네임 중복 체크
        </button>
        <span>
          결과: <strong>{nicknameResult}</strong>
        </span>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <button
          type="button"
          onClick={handleEmailCheck}
          style={{ marginRight: "10px", padding: "6px 12px" }}
        >
          'noco@umc.com' 이메일 중복 체크
        </button>
        <span>
          결과: <strong>{emailResult}</strong>
        </span>
      </div>

      <div>
        <button
          type="button"
          onClick={handleFetchRatings}
          style={{ marginRight: "10px", padding: "6px 12px" }}
        >
          1번 유저 평점 목록 조회
        </button>
        {ratings.length > 0 && (
          <ul style={{ marginTop: "10px", fontSize: "14px" }}>
            {ratings.map((r) => (
              <li key={r.ratingId}>
                [영화 ID: {r.movieId}] 평점: {r.score}점 - "{r.comment}"
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
