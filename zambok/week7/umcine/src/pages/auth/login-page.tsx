import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const canSubmit = isEmailValid && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setMessage(
      "로그인 화면의 입력 검증이 완료되었습니다. 실제 로그인 API는 아직 연결되지 않았습니다.",
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <Link to="/" className="mb-8 block text-2xl font-bold text-blue-400">
          UMCine
        </Link>

        <h1 className="mb-2 text-3xl font-bold">로그인</h1>

        <p className="mb-8 text-sm text-zinc-400">
          UMCine에 오신 것을 환영합니다.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="login-email" className="mb-2 block text-sm font-medium">
              이메일
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setMessage("");
              }}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            {email.length > 0 && !isEmailValid && (
              <p className="mt-2 text-sm text-red-400">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="login-password" className="mb-2 block text-sm font-medium">
              비밀번호
            </label>

            <div className="flex overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 focus-within:border-blue-500">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setMessage("");
                }}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="px-4 text-sm text-zinc-400 hover:text-white"
              >
                {showPassword ? "숨기기" : "보기"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            로그인
          </button>

          {message && (
            <p role="status" className="rounded-lg bg-zinc-800 p-4 text-sm text-blue-300">
              {message}
            </p>
          )}
        </form>

        <div className="mt-7 flex items-center justify-between text-sm">
  <span className="text-zinc-400">아직 계정이 없으신가요?</span>
  <span className="text-zinc-500">
    회원가입 준비 중
  </span>
</div>

        <div className="mt-8 border-t border-zinc-800 pt-5">
          <Link to="/mypage" className="text-sm text-zinc-400 hover:text-white">
            내 정보 화면 미리보기
          </Link>
          <p className="mt-2 text-xs text-zinc-500">
            7주차 퍼블리싱 실습용 화면으로, 실제 로그인 상태와 무관하게 열립니다.
          </p>
        </div>
      </div>
    </main>
  );
}