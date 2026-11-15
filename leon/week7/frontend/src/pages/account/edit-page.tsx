import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { getMemberProfile, saveMemberProfile, type MemberProfile } from "../../utils/member-profile";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass = "h-12 w-full rounded-lg border border-[#dfe3e8] bg-white px-4 text-sm outline-none placeholder:text-[#a3abb7] focus:border-[#2f6ce5] focus:ring-3 focus:ring-[#2f6ce5]/10";

export function EditPage() {
    const [form, setForm] = useState<MemberProfile>(getMemberProfile);
    const navigate = useNavigate();
    const isEmailValid = EMAIL_REGEX.test(form.email.trim());
    const isNicknameValid = form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
    const isIntroductionValid = form.introduction.length <= 120;
    const canSubmit = isEmailValid && isNicknameValid && isIntroductionValid;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSubmit) return;

        saveMemberProfile({
            email: form.email.trim(),
            nickname: form.nickname.trim(),
            favoriteGenre: form.favoriteGenre.trim(),
            introduction: form.introduction.trim(),
        });
        void navigate({ to: "/account/profile" });
    }

    return (
        <main className="flex-1 px-4 py-12 max-sm:py-8">
            <div className="mx-auto max-w-[680px]">
                <Link to="/account/profile" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#69717e] hover:text-[#2f6ce5]">← 내 정보로 돌아가기</Link>
                <h1 className="mb-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보 수정</h1>
                <p className="mb-8 text-sm text-[#69717e]">입력한 내용은 저장 후 내 정보 화면에 바로 반영됩니다.</p>

                <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-[#e6e9ee] bg-white p-8 shadow-[0_12px_36px_rgba(23,25,31,0.04)] max-sm:p-5">
                    <div className="mb-6">
                        <label htmlFor="edit-nickname" className="mb-2 block text-sm font-bold">닉네임 <span className="text-[#2f6ce5]">*</span></label>
                        <input id="edit-nickname" className={inputClass} value={form.nickname} onChange={(event) => setForm((prev) => ({ ...prev, nickname: event.target.value }))} aria-invalid={form.nickname.length > 0 && !isNicknameValid} aria-describedby="edit-nickname-help" placeholder="2~12자로 입력해 주세요" />
                        <p id="edit-nickname-help" className={`mt-2 text-xs ${form.nickname.length > 0 && !isNicknameValid ? "text-[#d54b4b]" : "text-[#8a929f]"}`}>닉네임은 2~12자로 입력해 주세요.</p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="edit-email" className="mb-2 block text-sm font-bold">이메일 <span className="text-[#2f6ce5]">*</span></label>
                        <input id="edit-email" type="email" autoComplete="email" className={inputClass} value={form.email} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} aria-invalid={form.email.length > 0 && !isEmailValid} aria-describedby={form.email.length > 0 && !isEmailValid ? "edit-email-error" : undefined} placeholder="이메일을 입력해 주세요" />
                        {form.email.length > 0 && !isEmailValid && <p id="edit-email-error" className="mt-2 text-xs text-[#d54b4b]">올바른 이메일 형식으로 입력해 주세요.</p>}
                    </div>
                    <div className="mb-6">
                        <label htmlFor="edit-genre" className="mb-2 block text-sm font-bold">좋아하는 장르</label>
                        <select id="edit-genre" className={inputClass} value={form.favoriteGenre} onChange={(event) => setForm((prev) => ({ ...prev, favoriteGenre: event.target.value }))}>
                            <option value="">선택해 주세요</option>
                            {["드라마", "코미디", "액션", "스릴러", "로맨스", "애니메이션", "SF", "다큐멘터리"].map((genre) => <option key={genre} value={genre}>{genre}</option>)}
                        </select>
                    </div>
                    <div className="mb-8">
                        <label htmlFor="edit-introduction" className="mb-2 block text-sm font-bold">한 줄 소개</label>
                        <textarea id="edit-introduction" className={`${inputClass} min-h-28 resize-y py-3`} value={form.introduction} onChange={(event) => setForm((prev) => ({ ...prev, introduction: event.target.value }))} aria-invalid={!isIntroductionValid} aria-describedby="edit-introduction-count" placeholder="나를 소개해 주세요" />
                        <p id="edit-introduction-count" className={`mt-2 text-right text-xs ${isIntroductionValid ? "text-[#8a929f]" : "text-[#d54b4b]"}`}>{form.introduction.length} / 120자</p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Link to="/account/profile" className="inline-flex h-12 items-center rounded-lg border border-[#dfe3e8] px-6 text-sm font-bold text-[#616875] hover:bg-[#f7f8fa]">취소</Link>
                        <button type="submit" disabled={!canSubmit} className="h-12 rounded-lg bg-[#2f6ce5] px-7 text-sm font-bold text-white hover:bg-[#245bd0] disabled:cursor-not-allowed disabled:bg-[#b9c8e5] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2f6ce5]/35">저장하기</button>
                    </div>
                </form>
            </div>
        </main>
    );
}
