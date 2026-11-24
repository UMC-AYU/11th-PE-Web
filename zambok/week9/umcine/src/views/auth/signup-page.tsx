"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient, apiErrorMessage } from "../../api/api-client";

const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500";

export function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const signup = useMutation({
    mutationFn: (body: { email: string; nickname: string; password: string }) =>
      apiClient.post("members", { json: body }).json(),
    gcTime: 0,
    onSuccess: () => router.replace("/login"),
  });
  const isValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    nickname.trim().length >= 2 && nickname.trim().length <= 12 &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValid && !signup.isPending) {
      signup.mutate({ email: email.trim(), nickname: nickname.trim(), password });
    }
  }

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">회원가입</h1>
      <form onSubmit={submit} noValidate className="space-y-5">
        <label className="block space-y-2">
          <span>이메일</span>
          <input className={inputClass} type="email" autoComplete="email" required
            value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span>닉네임 (2~12자)</span>
          <input className={inputClass} autoComplete="nickname" required maxLength={12}
            value={nickname} onChange={(event) => setNickname(event.target.value)} />
        </label>
        <label className="block space-y-2">
          <span>비밀번호</span>
          <input className={inputClass} type="password" autoComplete="new-password" required
            aria-describedby="signup-password-hint"
            value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <p id="signup-password-hint" className="text-sm text-zinc-400">
          영문 대소문자, 숫자, 특수문자 (!@#$%^&amp;*)를 포함해 8자 이상 입력해 주세요.
        </p>
        {signup.isError && (
          <p role="alert" className="text-sm text-red-400">
            {apiErrorMessage(signup.error, "회원가입에 실패했습니다. 다시 시도해 주세요.")}
          </p>
        )}
        <button type="submit" disabled={!isValid || signup.isPending}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-40">
          {signup.isPending ? "가입 중…" : "가입하기"}
        </button>
      </form>
      <Link href="/login" className="mt-6 inline-block text-sm text-blue-400 hover:underline">
        로그인으로 돌아가기
      </Link>
    </>
  );
}
