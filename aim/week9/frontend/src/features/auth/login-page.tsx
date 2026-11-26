"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_WRAPPER =
  "flex min-h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-200";

const INPUT_CLASS =
  "w-full min-w-0 py-2 text-sm outline-none placeholder:text-gray-400";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();

  const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || loginMutation.isPending) return;

    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  }

  return (
    <main className="grid min-h-[calc(100dvh-72px)] place-items-center bg-gray-100 px-5 py-12 text-gray-900">
      <section className="w-full max-w-[360px]" aria-labelledby="login-title">
        <h1 id="login-title" className="mb-4 text-3xl font-bold tracking-tight">
          로그인
        </h1>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-sm font-semibold"
            >
              이메일
            </label>
            <div className={INPUT_WRAPPER}>
              <img
                src="/icons/movie-icons/mail.svg"
                alt=""
                className="size-4 shrink-0"
              />
              <input
                id="login-email"
                className={INPUT_CLASS}
                type="email"
                autoComplete="username"
                placeholder="name@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-sm font-semibold"
            >
              비밀번호
            </label>
            <div className={INPUT_WRAPPER}>
              <img
                src="/icons/movie-icons/lock.svg"
                alt=""
                className="size-4 shrink-0"
              />
              <input
                id="login-password"
                className={INPUT_CLASS}
                type="password"
                autoComplete="current-password"
                placeholder="비밀번호"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || loginMutation.isPending}
            className="min-h-10 w-full rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {loginMutation.isPending ? "로그인 중" : "로그인"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-600">
          처음이신가요?{" "}
          <Link href="/signup" className="font-semibold text-blue-600">
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}