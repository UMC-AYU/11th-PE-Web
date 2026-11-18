import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getApiErrorMessage } from "../../api/api-client";
import { useSignupMutation } from "../../hooks/use-signup-mutation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export function SignupPage() {
    const [form, setForm] = useState({ email: "", nickname: "", password: "" });
    const mutation = useSignupMutation();
    const valid = EMAIL_REGEX.test(form.email.trim()) && form.nickname.trim().length >= 2
        && form.nickname.trim().length <= 12 && PASSWORD_REGEX.test(form.password);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!valid || mutation.isPending) return;
        mutation.mutate({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
    }

    return <main className="flex flex-1 items-center justify-center px-4 py-16">
        <section className="w-full max-w-[440px]">
            <h1 className="mb-2 text-center text-[34px] font-extrabold">회원가입</h1>
            <p className="mb-8 text-center text-sm text-[#69717e]">UMCine에서 영화 기록을 시작해 보세요.</p>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e6e9ee] bg-white p-9 max-sm:p-6">
                <label htmlFor="signup-email" className="mb-2 block text-sm font-bold">이메일</label>
                <input id="signup-email" type="email" autoComplete="email" value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} className="mb-5 h-12 w-full rounded-lg border border-[#dfe3e8] px-4 text-sm" />
                <label htmlFor="signup-nickname" className="mb-2 block text-sm font-bold">닉네임</label>
                <input id="signup-nickname" value={form.nickname} maxLength={12} onChange={(event) => setForm((prev) => ({ ...prev, nickname: event.target.value }))} className="mb-1 h-12 w-full rounded-lg border border-[#dfe3e8] px-4 text-sm" />
                <p className="mb-5 text-xs text-[#8a929f]">2~12자</p>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-bold">비밀번호</label>
                <input id="signup-password" type="password" autoComplete="new-password" value={form.password} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} className="mb-1 h-12 w-full rounded-lg border border-[#dfe3e8] px-4 text-sm" />
                <p className="mb-6 text-xs text-[#8a929f]">대문자·소문자·숫자·특수문자를 포함한 8자 이상</p>
                {mutation.isError && <p role="alert" className="mb-4 text-sm text-[#d54b4b]">{getApiErrorMessage(mutation.error, "회원가입에 실패했어요. 입력값이나 중복 여부를 확인해 주세요.")}</p>}
                <button type="submit" disabled={!valid || mutation.isPending} className="h-12 w-full rounded-lg bg-[#2f6ce5] text-sm font-bold text-white disabled:bg-[#b9c8e5]">{mutation.isPending ? "가입 중…" : "가입하기"}</button>
            </form>
            <p className="mt-6 text-center text-sm text-[#69717e]">이미 계정이 있나요? <Link to="/login" className="font-bold text-[#2f6ce5]">로그인</Link></p>
        </section>
    </main>;
}
