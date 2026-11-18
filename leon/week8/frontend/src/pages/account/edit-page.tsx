import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { getApiErrorMessage } from "../../api/api-client";
import { getMe, type MemberInfo } from "../../api/members/me";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";

export function EditPage() {
    const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe, staleTime: 5 * 60 * 1000 });
    if (!meQuery.data) return null;
    return <EditForm profile={meQuery.data} />;
}

function EditForm({ profile }: { profile: MemberInfo }) {
    const [nickname, setNickname] = useState(profile.nickname);
    const mutation = useUpdateMeMutation();
    const navigate = useNavigate();
    const trimmed = nickname.trim();
    const valid = trimmed.length >= 2 && trimmed.length <= 12;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!valid || mutation.isPending) return;
        mutation.mutate({ nickname: trimmed }, { onSuccess: () => void navigate({ to: "/account/profile" }) });
    }

    return <main className="flex-1 px-4 py-12 max-sm:py-8">
        <div className="mx-auto max-w-[680px]">
            <Link to="/account/profile" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#69717e] hover:text-[#2f6ce5]">← 마이페이지로 돌아가기</Link>
            <h1 className="mb-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보 수정</h1>
            <p className="mb-8 text-sm text-[#69717e]">닉네임을 수정하면 마이페이지와 헤더에 바로 반영돼요.</p>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#e6e9ee] bg-white p-8 max-sm:p-5">
                <label htmlFor="edit-nickname" className="mb-2 block text-sm font-bold">닉네임</label>
                <input id="edit-nickname" value={nickname} onChange={(event) => setNickname(event.target.value)} maxLength={12} aria-invalid={nickname.length > 0 && !valid} className="h-12 w-full rounded-lg border border-[#dfe3e8] px-4 text-sm outline-none focus:border-[#2f6ce5]" />
                <p className="mt-2 text-xs text-[#8a929f]">2~12자로 입력해 주세요.</p>
                <label htmlFor="edit-email" className="mt-6 mb-2 block text-sm font-bold">이메일</label>
                <input id="edit-email" value={profile.email} readOnly className="h-12 w-full rounded-lg border border-[#dfe3e8] bg-[#f7f8fa] px-4 text-sm text-[#69717e]" />
                {mutation.isError && <p role="alert" className="mt-4 text-sm text-[#d54b4b]">{getApiErrorMessage(mutation.error, "정보 수정에 실패했어요. 닉네임을 확인해 주세요.")}</p>}
                <div className="mt-8 flex justify-end gap-3">
                    <Link to="/account/profile" className="inline-flex h-12 items-center rounded-lg border border-[#dfe3e8] px-6 text-sm font-bold">취소</Link>
                    <button type="submit" disabled={!valid || mutation.isPending} className="h-12 rounded-lg bg-[#2f6ce5] px-7 text-sm font-bold text-white disabled:bg-[#b9c8e5]">{mutation.isPending ? "저장 중…" : "저장하기"}</button>
                </div>
            </form>
        </div>
    </main>;
}
