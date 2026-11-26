"use client"

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const PASSWORD_HINT =
  "영문 대문자·소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type FormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const signupMutation = useSignupMutation();
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  const nicknameLength = form.nickname.trim().length;
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid = nicknameLength >= 2 && nicknameLength <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const fields = [
    {
      key: "email",
      label: "이메일",
      type: "email",
      autoComplete: "email",
      placeholder: "name@example.com",
      showError: form.email.length > 0 && !isEmailValid,
      message: "이메일 형식을 확인해 주세요.",
      hasDuplicateCheck: true,
    },
    {
      key: "nickname",
      label: "닉네임",
      type: "text",
      autoComplete: "nickname",
      placeholder: "2–12자",
      showError: form.nickname.length > 0 && !isNicknameValid,
      message: "닉네임은 2자 이상 12자 이하로 입력해 주세요.",
      hasDuplicateCheck: true,
    },
    {
      key: "password",
      label: "비밀번호",
      type: "password",
      autoComplete: "new-password",
      placeholder: "8자 이상",
      showError: form.password.length > 0 && !isPasswordValid,
      message: PASSWORD_HINT,
      hasDuplicateCheck: false,
    },
    {
      key: "passwordConfirm",
      label: "비밀번호 확인",
      type: "password",
      autoComplete: "new-password",
      placeholder: "다시 입력",
      showError: form.passwordConfirm.length > 0 && !isPasswordConfirmValid,
      message: "비밀번호가 일치하지 않아요.",
      hasDuplicateCheck: false,
    },
  ] as const;

  function handleChangeField(key: FormKey, value: string) {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      // 값을 바꾸면 해당 입력칸의 중복 확인 결과만 초기화해요.
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }

    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    const value = form[key].trim();

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    let isAvailable = false;

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(value)
          : await checkNicknameDuplicate(value);

      isAvailable = response.available;
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { isChecking: false, isAvailable },
      }));
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault();

  if (!canSubmit || signupMutation.isPending) return;

  signupMutation.mutate({
    email: form.email.trim(),
    nickname: form.nickname.trim(),
    password: form.password,
  });
}

  return (
    <main className="grid min-h-[calc(100dvh-72px)] place-items-center bg-gray-100 px-5 py-12 text-gray-900">
      <section className="w-full max-w-[360px]" aria-labelledby="signup-title">
        <h1 id="signup-title" className="mb-4 text-3xl font-bold tracking-tight">
          회원가입
        </h1>

        <form className="space-y-3" onSubmit={handleSubmit} noValidate>
          {fields.map((field) => {
            const inputId = `signup-${field.key}`;
            const messageId = `${inputId}-message`;
            const showMessage = field.showError || field.key === "password";
            const duplicateKey = field.hasDuplicateCheck ? field.key : undefined;
            const isChecking = duplicateKey
              ? duplicateCheck[duplicateKey].isChecking
              : false;

            return (
              <div key={field.key}>
                <label
                  htmlFor={inputId}
                  className="mb-1 block text-sm font-semibold"
                >
                  {field.label}
                </label>

                <div
                  className={`flex min-h-10 items-center rounded-md border bg-white focus-within:ring-2 focus-within:ring-blue-200 ${
                    field.showError ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <input
                    id={inputId}
                    className="min-w-0 flex-1 px-3 py-2 text-sm outline-none placeholder:text-gray-400"
                    type={field.type}
                    autoComplete={field.autoComplete}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    disabled={isChecking}
                    onChange={(event) =>
                      handleChangeField(field.key, event.target.value)
                    }
                    aria-invalid={field.showError}
                    aria-describedby={showMessage ? messageId : undefined}
                  />

                  {duplicateKey && (
                    <button
                      type="button"
                      disabled={
                        isChecking ||
                        !(duplicateKey === "email"
                          ? isEmailValid
                          : isNicknameValid)
                      }
                      onClick={() => void handleCheckDuplicate(duplicateKey)}
                      className="shrink-0 px-3 text-xs font-semibold text-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isChecking ? "확인 중" : "중복 확인"}
                    </button>
                  )}
                </div>

                {showMessage && (
                  <p
                    id={messageId}
                    className={`mt-1 text-xs ${
                      field.showError ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {field.message}
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={!canSubmit || signupMutation.isPending}
            className="min-h-10 w-full rounded-md bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {signupMutation.isPending ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-gray-600">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            로그인
          </Link>
        </p>
      </section>
    </main>
  );
}