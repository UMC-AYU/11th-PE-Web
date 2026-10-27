import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getMemberRatings, RatingItem } from "../api/backend";

export function RatingsPage() {
  const [memberId, setMemberId] = useState("");
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    const idNum = Number(memberId.trim());
    if (!memberId.trim() || isNaN(idNum) || idNum <= 0) {
      alert("올바른 유저 번호를 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setRatings([]);

    const res = await getMemberRatings(idNum);
    setStatusCode(res.status);
    setIsLoading(false);

    if (res.status === 200 && res.data) {
      setRatings(res.data);
      if (res.data.length === 0) {
        setMessage("작성한 평점이 없습니다.");
      }
    } else {
      setMessage(res.error || "조회에 실패했습니다.");
    }
  };

  return (
    <main
      style={{
        padding: "30px 20px",
        maxWidth: "600px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* 우측 상단 영화목록 돌아가기 텍스트 링크 */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "var(--accent)",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          영화목록
        </Link>
      </div>

      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        평점 목록 조회
      </h1>

      {/* 유저 번호 입력 박스 */}
      <div style={{ marginBottom: "30px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          유저 번호
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="유저 번호 입력"
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              fontSize: "16px",
              background: "var(--bg)",
              color: "var(--text-h)",
            }}
          />
          <button
            type="button"
            onClick={handleSearch}
            style={{
              padding: "12px 24px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            조회
          </button>
        </div>
      </div>

      {/* 조회 결과 표시 영역 */}
      <div
        style={{
          minHeight: "150px",
          padding: "20px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "var(--code-bg)",
          textAlign: "left",
        }}
      >
        {statusCode !== null && (
          <div
            style={{
              marginBottom: "10px",
              fontSize: "14px",
              color: "var(--text-h)",
            }}
          >
            <strong>응답 상태코드:</strong> {statusCode}
          </div>
        )}

        {isLoading ? (
          <p>조회 중...</p>
        ) : message ? (
          <p style={{ color: "#ef4444", margin: 0 }}>{message}</p>
        ) : ratings.length > 0 ? (
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            {ratings.map((item) => (
              <li
                key={item.ratingId}
                style={{ marginBottom: "12px", lineHeight: "1.5" }}
              >
                <div>
                  <strong>영화 ID:</strong> {item.movieId} |{" "}
                  <strong>별점:</strong> {item.score}점
                </div>
                <div>
                  <strong>코멘트:</strong> {item.comment || "없음"}
                </div>
                <div style={{ fontSize: "12px", color: "gray" }}>
                  작성일: {new Date(item.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "gray", margin: 0 }}>
            유저 번호를 적고 [조회] 버튼을 눌러주세요.
          </p>
        )}
      </div>
    </main>
  );
}
