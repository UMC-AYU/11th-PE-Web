import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useLoginMutation } from "../../hooks/use-login-mutation";
import { getApiErrorMessage } from "../../api/api-client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_FORM = { email: "", password: "" };

export function LoginPage() {
    const [form, setForm] = useState(DEFAULT_FORM);
    const loginMutation = useLoginMutation();
    const isEmailValid = EMAIL_REGEX.test(form.email.trim());
    const isPasswordValid = form.password.length > 0;
    const canSubmit = isEmailValid && isPasswordValid;
    const showEmailError = form.email.length > 0 && !isEmailValid;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSubmit || loginMutation.isPending) return;
        loginMutation.mutate({ email: form.email.trim(), password: form.password });
    }

    return (
        <main className="flex flex-1 items-center justify-center px-4 py-16 max-sm:py-10">
            <section className="w-full max-w-[440px]" aria-labelledby="login-title">
                <div className="mb-8 text-center">
                    <span className="mb-5 inline-grid size-14 place-items-center rounded-2xl bg-[#e9f0ff]">
                        <img src="/icons/movie.svg" alt="" className="size-8" />
                    </span>
                    <h1 id="login-title" className="text-[34px] font-extrabold tracking-[-1.5px]">로그인</h1>
                    <p className="mt-2 text-sm text-[#69717e]">UMCine에서 나만의 영화 기록을 이어가세요.</p>
                </div>

                <form className="rounded-2xl border border-[#e6e9ee] bg-white p-9 shadow-[0_12px_36px_rgba(23,25,31,0.05)] max-sm:p-6" onSubmit={handleSubmit} noValidate>
                    <div className="mb-5">
                        <label htmlFor="login-email" className="mb-2 block text-sm font-bold">이메일</label>
                        <div className="flex items-center gap-3 rounded-lg border border-[#dfe3e8] px-4 focus-within:border-[#2f6ce5] focus-within:ring-3 focus-within:ring-[#2f6ce5]/10">
                            <img src="/icons/mail.svg" alt="" className="size-5 opacity-55" />
                            <input id="login-email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} aria-invalid={showEmailError} aria-describedby={showEmailError ? "login-email-error" : undefined} placeholder="이메일을 입력해 주세요" className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3abb7]" />
                        </div>
                        {showEmailError && <p id="login-email-error" className="mt-2 text-xs text-[#d54b4b]">올바른 이메일 형식으로 입력해 주세요.</p>}
                    </div>

                    <div className="mb-7">
                        <label htmlFor="login-password" className="mb-2 block text-sm font-bold">비밀번호</label>
                        <div className="flex items-center gap-3 rounded-lg border border-[#dfe3e8] px-4 focus-within:border-[#2f6ce5] focus-within:ring-3 focus-within:ring-[#2f6ce5]/10">
                            <img src="/icons/lock.svg" alt="" className="size-5 opacity-55" />
                            <input id="login-password" type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="비밀번호를 입력해 주세요" className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#a3abb7]" />
                        </div>
                    </div>

                    {loginMutation.isError && <p role="alert" className="mb-4 text-sm text-[#d54b4b]">{getApiErrorMessage(loginMutation.error, "로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요.")}</p>}
                    <button type="submit" disabled={!canSubmit || loginMutation.isPending} className="h-12 w-full rounded-lg bg-[#2f6ce5] text-sm font-bold text-white transition-colors hover:bg-[#245bd0] disabled:cursor-not-allowed disabled:bg-[#b9c8e5] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2f6ce5]/35">{loginMutation.isPending ? "로그인 중…" : "로그인"}</button>
                </form>

                <p className="mt-6 text-center text-sm text-[#69717e]">계정이 없나요? <Link to="/signup" className="font-bold text-[#2f6ce5] hover:underline">회원가입</Link></p>
            </section>
        </main>
    );
}
