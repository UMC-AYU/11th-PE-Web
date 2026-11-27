"use client";

import { useState } from "react";
import Link from "next/link";
import { ApiError } from "@/api/api-client";
import { FormField, InputIcon, inputClass, type Feedback } from "@/components/form/form-field";
import { useLoginMutation } from "@/hooks/use-login-mutation";

// 이메일 형식 검사 (회원가입과 같은 규칙)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginForm = typeof DEFAULT_FORM;
type LoginFormKey = keyof LoginForm;

export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  // 성공하면 토큰 저장 → 내 정보 캐시 갱신 → 홈 이동은 useLoginMutation이 맡아요.
  const loginMutation = useLoginMutation();

  const email = form.email.trim();
  const isEmailValid = EMAIL_REGEX.test(email);
  const isPasswordFilled = form.password.length > 0;
  const isFormValid = isEmailValid && isPasswordFilled;

  const emailFeedback: Feedback =
    form.email.length > 0 && !isEmailValid
      ? { tone: "error", message: "올바른 이메일 형식이 아니에요." }
      : null;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // 값을 고치면 이전 실패 안내를 지워요.
    if (loginMutation.isError) loginMutation.reset();
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || loginMutation.isPending) return;

    loginMutation.mutate({ email, password: form.password });
  };

  return (
    <main className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="text-3xl font-bold">로그인</h1>
      <p className="mt-2 text-sm text-gray-500">다시 오신 걸 환영해요. 이메일로 로그인해 주세요.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <FormField id="login-email" label="이메일" feedback={emailFeedback}>
          <div className="relative">
            <InputIcon src="/icons/mail.svg" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="umc@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              aria-invalid={emailFeedback !== null}
              aria-describedby="login-email-feedback"
              className={inputClass(emailFeedback, { withIcon: true })}
            />
          </div>
        </FormField>

        <FormField id="login-password" label="비밀번호">
          <div className="relative">
            <InputIcon src="/icons/lock.svg" />
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              maxLength={72}
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              className={inputClass(null, { withIcon: true })}
            />
          </div>
        </FormField>

        <button
          type="submit"
          disabled={!isFormValid || loginMutation.isPending}
          className="mt-2 h-11 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {loginMutation.isPending ? "로그인하는 중..." : "로그인"}
        </button>

        {loginMutation.isError && (
          <p role="alert" className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-600">
            {/* 서버는 없는 이메일과 틀린 비밀번호를 같은 메시지로 알려줘요. */}
            {loginMutation.error instanceof ApiError
              ? loginMutation.error.message
              : "로그인에 실패했어요. 다시 시도해 주세요."}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        아직 회원이 아니신가요?{" "}
        <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
          회원가입
        </Link>
      </p>
    </main>
  );
}
