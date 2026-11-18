import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

import { apiErrorMessage } from "../../api/api-client";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage({ expired }: { expired?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const login = useLoginMutation();

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const canSubmit = isEmailValid && password.length > 0 && !login.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    login.mutate({ email: email.trim(), password });
  }

  return (
    <>
    <h1 className="mb-2 text-3xl font-bold">로그인</h1>

    <p className="mb-8 text-sm text-zinc-400">
      UMCine에 오신 것을 환영합니다.
    </p>

    {expired && <p role="status" className="mb-4 text-sm text-amber-300">세션이 만료되었습니다. 다시 로그인해 주세요.</p>}

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
            if (login.isError) login.reset();
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
              if (login.isError) login.reset();
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
        {login.isPending ? "로그인 중…" : "로그인"}
      </button>

      {login.isError && (
        <p role="alert" className="rounded-lg bg-zinc-800 p-4 text-sm text-red-400">
          {apiErrorMessage(login.error, "로그인에 실패했습니다. 다시 시도해 주세요.")}
        </p>
      )}
    </form>

    <div className="mt-7 flex items-center justify-between text-sm">
      <span className="text-zinc-400">아직 계정이 없으신가요?</span>
      <Link to="/signup" className="font-medium text-blue-400 hover:underline">
        회원가입
      </Link>
    </div>
    </>
  );
}
