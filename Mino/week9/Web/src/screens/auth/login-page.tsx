"use client";

import Link from "next/link";
import { useState, type SubmitEvent } from "react";
import { AccountField } from "../../components/account/account-field";
import { AccountPanel } from "../../components/account/account-panel";
import { primaryButtonClass } from "../../components/account/account-styles";
import { isValidEmail } from "./account-validation";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getApiErrorMessage } from "../../api/api-response";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLoginMutation();
  const canSubmit = isValidEmail(email) && password.length > 0;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit && !loginMutation.isPending) {
      loginMutation.mutate({ email: email.trim(), password });
    }
  }

  return (
    <AccountPanel title="로그인">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AccountField label="이메일" name="email" type="email" autoComplete="username" placeholder="이메일을 입력해 주세요" required
          disabled={loginMutation.isPending} value={email} onChange={(event) => { setEmail(event.target.value); loginMutation.reset(); }}
          error={email && !isValidEmail(email) ? "이메일 형식을 확인해 주세요." : undefined} />
        <AccountField label="비밀번호" name="password" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" required
          disabled={loginMutation.isPending} value={password} onChange={(event) => { setPassword(event.target.value); loginMutation.reset(); }} />
        <button className={primaryButtonClass} type="submit" disabled={!canSubmit || loginMutation.isPending}>{loginMutation.isPending ? "로그인 중" : "로그인"}</button>
        {loginMutation.isError && <p role="alert" className="text-center text-sm text-red-700">{getApiErrorMessage(loginMutation.error)}</p>}
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">아직 계정이 없으신가요? <Link className="font-bold text-blue-700 hover:underline" href="/signup">회원가입</Link></p>
    </AccountPanel>
  );
}
