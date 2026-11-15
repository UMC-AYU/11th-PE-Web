import { Link } from "@tanstack/react-router";
import { getMemberProfile } from "../../utils/member-profile";

export function ProfilePage() {
    const profile = getMemberProfile();

    return (
        <main className="flex-1 px-4 py-12 max-sm:py-8">
            <div className="mx-auto max-w-[880px]">
                <p className="mb-2 text-sm font-bold text-[#2f6ce5]">MY PAGE</p>
                <h1 className="mb-2 text-[34px] font-extrabold tracking-[-1.5px]">내 정보</h1>
                <p className="mb-8 text-sm text-[#69717e]">UMCine에 표시할 프로필 정보를 확인해 보세요.</p>

                <section className="overflow-hidden rounded-2xl border border-[#e6e9ee] bg-white shadow-[0_12px_36px_rgba(23,25,31,0.04)]" aria-label="프로필 정보">
                    <div className="flex flex-wrap items-center gap-5 border-b border-[#edf0f3] px-8 py-7 max-sm:px-5">
                        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#e9f0ff] text-2xl font-extrabold text-[#2f6ce5]" aria-hidden="true">{profile.nickname.trim().charAt(0) || "U"}</div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-extrabold tracking-[-0.5px]">{profile.nickname}</h2>
                            <p className="mt-1 break-all text-sm text-[#69717e]">{profile.email}</p>
                        </div>
                        <Link to="/account/edit" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe3e8] px-4 text-sm font-bold text-[#25282f] hover:bg-[#f7f8fa] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#2f6ce5]/35"><img src="/icons/edit.svg" alt="" className="size-4 opacity-70" />정보 수정</Link>
                    </div>

                    <dl className="grid gap-y-7 px-8 py-8 max-sm:px-5">
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">닉네임</dt><dd className="min-w-0 break-words text-sm font-semibold">{profile.nickname}</dd></div>
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">이메일</dt><dd className="min-w-0 break-all text-sm font-semibold">{profile.email}</dd></div>
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">좋아하는 장르</dt><dd className="text-sm font-semibold">{profile.favoriteGenre || "아직 입력하지 않았어요"}</dd></div>
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">한 줄 소개</dt><dd className="whitespace-pre-wrap text-sm font-semibold leading-6">{profile.introduction || "아직 입력하지 않았어요"}</dd></div>
                    </dl>
                </section>
                <p className="mt-4 text-xs text-[#8a929f]">예시 프로필이며 수정한 정보는 이 브라우저에 저장됩니다.</p>
            </div>
        </main>
    );
}
