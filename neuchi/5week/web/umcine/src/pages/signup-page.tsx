import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { checkNickname, checkEmail } from "../api/backend";

export function SignupPage() {
  // 닉네임 상태
  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<number | null>(null);
  const [nicknameMsg, setNicknameMsg] = useState("");
  const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(
    null,
  );

  // 이메일 상태
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<number | null>(null);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // 닉네임 중복 체크 클릭
  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    const res = await checkNickname(nickname.trim());
    setNicknameStatus(res.status);

    if (res.status === 200 && res.available !== undefined) {
      if (res.available) {
        setNicknameMsg("사용가능한 아이디 입니다");
        setNicknameAvailable(true);
      } else {
        setNicknameMsg("중복입니다");
        setNicknameAvailable(false);
      }
    } else {
      setNicknameMsg(res.error || "오류가 발생했습니다.");
      setNicknameAvailable(false);
    }
  };

  // 이메일 중복 체크 클릭
  const handleCheckEmail = async () => {
    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }
    const res = await checkEmail(email.trim());
    setEmailStatus(res.status);

    if (res.status === 200 && res.available !== undefined) {
      if (res.available) {
        setEmailMsg("사용가능한 이메일 입니다");
        setEmailAvailable(true);
      } else {
        setEmailMsg("중복입니다");
        setEmailAvailable(false);
      }
    } else {
      setEmailMsg(res.error || "오류가 발생했습니다.");
      setEmailAvailable(false);
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

      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>회원가입</h1>

      {/* 닉네임 입력란 그룹 */}
      <div style={{ marginBottom: "45px", position: "relative" }}>
        {/* 닉네임란 바깥쪽 오른쪽 위 상태 코드 */}
        {nicknameStatus !== null && (
          <span
            style={{
              position: "absolute",
              top: "-22px",
              right: "0",
              fontSize: "14px",
              fontWeight: "bold",
              color: nicknameStatus === 200 ? "#10b981" : "#ef4444",
            }}
          >
            상태코드: {nicknameStatus}
          </span>
        )}

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          닉네임
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
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
            onClick={handleCheckNickname}
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            중복 체크
          </button>
        </div>

        {/* 닉네임란 바깥쪽 오른쪽 아래 문구 */}
        {nicknameMsg && (
          <span
            style={{
              position: "absolute",
              bottom: "-24px",
              right: "0",
              fontSize: "14px",
              fontWeight: "bold",
              color: nicknameAvailable ? "#10b981" : "#ef4444",
            }}
          >
            {nicknameMsg}
          </span>
        )}
      </div>

      {/* 이메일 입력란 그룹 */}
      <div style={{ marginBottom: "40px", position: "relative" }}>
        {/* 이메일란 바깥쪽 오른쪽 위 상태 코드 */}
        {emailStatus !== null && (
          <span
            style={{
              position: "absolute",
              top: "-22px",
              right: "0",
              fontSize: "14px",
              fontWeight: "bold",
              color: emailStatus === 200 ? "#10b981" : "#ef4444",
            }}
          >
            상태코드: {emailStatus}
          </span>
        )}

        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            textAlign: "left",
          }}
        >
          이메일
        </label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
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
            onClick={handleCheckEmail}
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            중복 체크
          </button>
        </div>

        {/* 이메일란 바깥쪽 오른쪽 아래 문구 */}
        {emailMsg && (
          <span
            style={{
              position: "absolute",
              bottom: "-24px",
              right: "0",
              fontSize: "14px",
              fontWeight: "bold",
              color: emailAvailable ? "#10b981" : "#ef4444",
            }}
          >
            {emailMsg}
          </span>
        )}
      </div>
    </main>
  );
}
