import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { getDemoProfile } from "../../lib/demo-profile";

export function MypagePage() {
  const [profile] = useState(getDemoProfile);

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-10 inline-block text-xl font-bold text-blue-400">
          UMCine
        </Link>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">내 정보</h1>
            <p className="mt-2 text-sm text-zinc-400">
              프로필 정보를 확인할 수 있습니다.
            </p>
          </div>

          <Link
            to="/mypage/edit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
          >
            정보 수정
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="mb-8 flex items-center gap-5 border-b border-zinc-800 pb-8">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold">
              {profile.nickname.charAt(0) || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{profile.nickname}</h2>
              <p className="mt-1 text-sm text-zinc-400">UMCine 회원 프로필 미리보기</p>
            </div>
          </div>

          <dl className="space-y-7">
            <div>
              <dt className="mb-2 text-sm text-zinc-400">닉네임</dt>
              <dd className="text-lg font-medium">{profile.nickname}</dd>
            </div>

            <div>
              <dt className="mb-2 text-sm text-zinc-400">이메일</dt>
              <dd className="text-lg font-medium">{profile.email}</dd>
            </div>

            <div>
              <dt className="mb-2 text-sm text-zinc-400">소개</dt>
              <dd className="whitespace-pre-wrap leading-7">
                {profile.introduction || "등록된 소개가 없습니다."}
              </dd>
            </div>
          </dl>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          현재 표시된 정보는 서버에서 조회한 회원 정보가 아닌 로컬 실습 데이터입니다.
        </p>
      </div>
    </main>
  );
}