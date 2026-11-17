import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkMemberAvailability } from "../../api/members/check-member-availability";
import { getApiErrorMessage } from "../../api/api-response";
import { useSignupMutation } from "../../hooks/use-signup-mutation";
import { AccountField } from "../../components/account/account-field";
import { AccountPanel } from "../../components/account/account-panel";
import { primaryButtonClass } from "../../components/account/account-styles";
import { isValidEmail, isValidNickname } from "./account-validation";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
const PASSWORD_HINT = "영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 포함해 8자 이상";
const EMPTY_FORM = { email: "", nickname: "", password: "", passwordConfirm: "" };
const DUPLICATE_FIELDS = [
  { name: "email", label: "이메일", placeholder: "이메일을 입력해 주세요", error: "이메일 형식을 확인해 주세요.", validate: isValidEmail },
  { name: "nickname", label: "닉네임", placeholder: "2~12자", error: "닉네임을 2~12자로 입력해 주세요.", validate: isValidNickname },
] as const;

type DuplicateField = (typeof DUPLICATE_FIELDS)[number];
type CheckStatus = "idle" | "checking" | "available" | "duplicate" | "error";

export function SignupPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [checks, setChecks] = useState<Record<DuplicateField["name"], CheckStatus>>({ email: "idle", nickname: "idle" });
  const signupMutation = useSignupMutation();
  const isSubmitting = signupMutation.isPending;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const passwordsMatch = form.passwordConfirm !== "" && form.password === form.passwordConfirm;
  const canSubmit = isPasswordValid && passwordsMatch &&
    DUPLICATE_FIELDS.every(({ name, validate }) => validate(form[name]) && checks[name] === "available");

  function changeField(name: keyof typeof EMPTY_FORM, value: string) {
    setForm((previous) => ({ ...previous, [name]: value }));
    if (name === "email" || name === "nickname") {
      setChecks((previous) => ({ ...previous, [name]: "idle" }));
    }
    signupMutation.reset();
  }

  async function checkDuplicate({ name, validate }: DuplicateField) {
    const value = form[name].trim();
    if (!validate(value) || checks[name] === "checking" || isSubmitting) return;

    setChecks((previous) => ({ ...previous, [name]: "checking" }));
    try {
      const { available } = await checkMemberAvailability(name, value);
      setChecks((previous) => ({ ...previous, [name]: available ? "available" : "duplicate" }));
    } catch {
      setChecks((previous) => ({ ...previous, [name]: "error" }));
    }
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || isSubmitting || signupMutation.isSuccess) return;
    signupMutation.mutate(
      { email: form.email.trim(), nickname: form.nickname.trim(), password: form.password },
      { onSuccess: () => setForm(EMPTY_FORM) },
    );
  }

  return (
    <AccountPanel title="회원가입">
      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={isSubmitting || signupMutation.isSuccess} className="space-y-4">
          {DUPLICATE_FIELDS.map((field) => {
            const { name, label, placeholder, validate } = field;
            const status = checks[name];
            const isValid = validate(form[name]);
            const checkError = {
              idle: undefined,
              checking: undefined,
              available: undefined,
              duplicate: `이미 사용 중인 ${label}이에요.`,
              error: "중복 확인에 실패했어요. 다시 시도해 주세요.",
            }[status];

            return (
              <AccountField
                key={name} name={name} label={label} placeholder={placeholder}
                type={name === "email" ? "email" : "text"} autoComplete={name}
                value={form[name]} onChange={(event) => changeField(name, event.target.value)}
                disabled={status === "checking"} required
                error={form[name] && !isValid ? field.error : checkError}
                status={status === "available" && !signupMutation.isSuccess ? `사용할 수 있는 ${label}이에요.` : undefined}
                action={(
                  <button className="rounded-md px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-slate-500" type="button" disabled={!isValid || status === "checking" || status === "available"} onClick={() => void checkDuplicate(field)}>
                    {status === "checking" ? "확인 중" : status === "available" ? "확인 완료" : "중복 확인"}
                  </button>
                )}
              />
            );
          })}
          <AccountField label="비밀번호" name="password" type="password" autoComplete="new-password" placeholder="8자 이상" required hint={PASSWORD_HINT}
            value={form.password} onChange={(event) => changeField("password", event.target.value)}
            error={form.password && !isPasswordValid ? PASSWORD_HINT : undefined} />
          <AccountField label="비밀번호 확인" name="passwordConfirm" type="password" autoComplete="new-password" placeholder="다시 입력" required
            value={form.passwordConfirm} onChange={(event) => changeField("passwordConfirm", event.target.value)}
            error={form.passwordConfirm && !passwordsMatch ? "비밀번호가 일치하지 않아요." : undefined} />
          <button className={primaryButtonClass} type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </fieldset>
        {(signupMutation.isSuccess || signupMutation.isError) && (
          <p role="status" className={`mt-4 text-center text-sm ${signupMutation.isSuccess ? "text-emerald-700" : "text-red-700"}`}>
            {signupMutation.isSuccess ? signupMutation.data.message : getApiErrorMessage(signupMutation.error)}
          </p>
        )}
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        {!signupMutation.isSuccess && "이미 계정이 있으신가요? "}
        <Link className="font-bold text-blue-700 hover:underline" to="/login">
          {signupMutation.isSuccess ? "로그인 화면으로 이동" : "로그인"}
        </Link>
      </p>
    </AccountPanel>
  );
}
