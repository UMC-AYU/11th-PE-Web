"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { ApiError } from "@/api/api-client";
import { checkEmail } from "@/api/members/check-email";
import { checkNickname } from "@/api/members/check-nickname";
import { FormField, inputClass, type Feedback } from "@/components/form/form-field";
import { useSignupMutation } from "@/hooks/use-signup-mutation";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함한 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultForm = typeof DEFAULT_FORM;
type DefaultFormKey = keyof DefaultForm;
type DefaultFormValue = DefaultForm[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  // 중복 확인은 버튼을 눌렀을 때만 서버에 요청해서 useMutation을 써요.
  const emailCheck = useMutation({ mutationFn: checkEmail });
  const nicknameCheck = useMutation({ mutationFn: checkNickname });
  // 회원가입 요청: 성공·실패 처리는 useSignupMutation 안의 onSuccess / onError가 맡아요.
  const signupMutation = useSignupMutation();

  const email = form.email.trim();
  const nickname = form.nickname.trim();

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(email);
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 지금 입력값으로 중복 확인을 통과했는지 확인해요.
  const isEmailAvailable =
    emailCheck.data?.available === true && emailCheck.data.email === email;
  const isNicknameAvailable =
    nicknameCheck.data?.available === true && nicknameCheck.data.nickname === nickname;

  // 모든 입력값이 유효하고 중복 확인까지 통과하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid &&
    isEmailAvailable &&
    isNicknameAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // 확인을 받은 뒤에 값을 바꾸면 다시 확인해야 해요.
    if (key === "email") emailCheck.reset();
    if (key === "nickname") nicknameCheck.reset();
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();

    // 버튼이 꺼져 있어도 Enter로 제출될 수 있어서 한 번 더 확인해요.
    // 요청 중에 다시 누르면 같은 요청이 두 번 가지 않도록 막아요.
    if (!isFormValid || signupMutation.isPending) return;

    // 비밀번호 확인 값은 화면에서만 쓰고 서버에는 보내지 않아요.
    signupMutation.mutate({ email, password: form.password, nickname });
  };

  const emailFeedback: Feedback = showEmailError
    ? { tone: "error", message: "올바른 이메일 형식이 아니에요." }
    : getCheckFeedback(emailCheck, "이메일", isEmailValid);

  const nicknameFeedback: Feedback = showNicknameError
    ? { tone: "error", message: "닉네임은 2자 이상 12자 이하로 입력해 주세요." }
    : getCheckFeedback(nicknameCheck, "닉네임", isNicknameValid);

  const passwordFeedback: Feedback = showPasswordError
    ? {
        tone: "error",
        message: "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요.",
      }
    : null;

  const passwordConfirmFeedback: Feedback = showPasswordConfirmError
    ? { tone: "error", message: "비밀번호가 일치하지 않아요." }
    : isPasswordConfirmValid
      ? { tone: "success", message: "비밀번호가 일치해요." }
      : null;

  return (
    <main className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="text-3xl font-bold">회원가입</h1>
      <p className="mt-2 text-sm text-gray-500">UMCine에서 영화 평점을 남겨 보세요.</p>

      {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 꺼요. */}
      <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
        <FormField id="signup-email" label="이메일" feedback={emailFeedback}>
          <div className="flex gap-2">
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="umc@example.com"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              aria-invalid={showEmailError}
              aria-describedby="signup-email-feedback"
              className={inputClass(emailFeedback)}
            />
            <CheckButton
              disabled={!isEmailValid || emailCheck.isPending || isEmailAvailable}
              isPending={emailCheck.isPending}
              onClick={() => emailCheck.mutate(email)}
            />
          </div>
        </FormField>

        <FormField id="signup-nickname" label="닉네임" feedback={nicknameFeedback}>
          <div className="flex gap-2">
            <input
              id="signup-nickname"
              autoComplete="nickname"
              placeholder="2~12자"
              maxLength={12}
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              aria-invalid={showNicknameError}
              aria-describedby="signup-nickname-feedback"
              className={inputClass(nicknameFeedback)}
            />
            <CheckButton
              disabled={!isNicknameValid || nicknameCheck.isPending || isNicknameAvailable}
              isPending={nicknameCheck.isPending}
              onClick={() => nicknameCheck.mutate(nickname)}
            />
          </div>
        </FormField>

        <FormField id="signup-password" label="비밀번호" feedback={passwordFeedback}>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="대소문자, 숫자, 특수문자 포함 8자 이상"
            // 서버(bcrypt)가 72자까지만 받아서 입력도 72자로 제한해요.
            maxLength={72}
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            aria-invalid={showPasswordError}
            aria-describedby="signup-password-feedback"
            className={inputClass(passwordFeedback)}
          />
        </FormField>

        <FormField
          id="signup-password-confirm"
          label="비밀번호 확인"
          feedback={passwordConfirmFeedback}
        >
          <input
            id="signup-password-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            maxLength={72}
            value={form.passwordConfirm}
            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
            aria-invalid={showPasswordConfirmError}
            aria-describedby="signup-password-confirm-feedback"
            className={inputClass(passwordConfirmFeedback)}
          />
        </FormField>

        <button
          type="submit"
          disabled={!isFormValid || signupMutation.isPending}
          className="mt-2 h-11 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {signupMutation.isPending ? "가입하는 중..." : "가입하기"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        이미 회원이신가요?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </main>
  );
}

// 중복 확인 요청 상태를 입력칸 아래 문구로 바꿔요.
function getCheckFeedback(
  check: { isPending: boolean; isError: boolean; error: Error | null; data?: { available: boolean } },
  label: string,
  isFormatValid: boolean,
): Feedback {
  if (check.isPending) return { tone: "info", message: "확인하고 있어요." };
  if (check.isError) {
    const message =
      check.error instanceof ApiError ? check.error.message : "중복 확인에 실패했어요.";
    return { tone: "error", message };
  }
  if (check.data) {
    return check.data.available
      ? { tone: "success", message: `사용할 수 있는 ${label}이에요.` }
      : { tone: "error", message: `이미 사용 중인 ${label}이에요.` };
  }
  // 형식은 맞지만 아직 확인 전이면 버튼을 누르도록 안내해요.
  if (isFormatValid) return { tone: "info", message: "중복 확인을 눌러 주세요." };
  return null;
}

function CheckButton({
  disabled,
  isPending,
  onClick,
}: {
  disabled: boolean;
  isPending: boolean;
  onClick: () => void;
}) {
  return (
    <button
      // 폼 안의 버튼은 기본이 submit이라서 type="button"으로 제출을 막아요.
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="h-11 shrink-0 rounded-md border border-gray-900 px-4 text-xs font-semibold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent"
    >
      {isPending ? "확인 중" : "중복 확인"}
    </button>
  );
}
