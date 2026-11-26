"use client";

import Link from "next/link";

import { useMemberQuery } from "../../hooks/use-member-query";
import { useAuthStore } from "../../stores/auth-store";
import { MemberQueryStatus } from "./member-query-status";

export function MypagePage() {
  const token = useAuthStore((state) => state.accessToken);
  return token ? <MemberProfile token={token} /> : null;
}

function MemberProfile({ token }: { token: string }) {
  const member = useMemberQuery(token);
  const profile = member.data;
  if (!profile) {
    return <MemberQueryStatus error={member.error} retry={() => void member.refetch()} />;
  }

  return (
    <>
    <div className="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">내 정보</h1>
        <p className="mt-2 text-sm text-zinc-400">
          프로필 정보를 확인할 수 있습니다.
        </p>
      </div>

      <Link
        href="/mypage/edit"
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
          <p className="mt-1 text-sm text-zinc-400">UMCine 회원</p>
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
          <dt className="mb-2 text-sm text-zinc-400">가입일</dt>
          <dd className="whitespace-pre-wrap leading-7">
            <time dateTime={profile.createdAt}>
              {new Date(profile.createdAt).toLocaleDateString("ko-KR")}
            </time>
          </dd>
        </div>
      </dl>
    </div>
    </>
  );
}
