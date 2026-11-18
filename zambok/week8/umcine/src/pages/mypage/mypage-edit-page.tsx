import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { apiErrorMessage } from "../../api/api-client";
import { updateMe, type MemberInfo } from "../../api/members/me";
import { memberKey, useMemberQuery } from "../../hooks/use-member-query";
import { useAuthStore } from "../../stores/auth-store";
import { MemberQueryStatus } from "./member-query-status";

const inputClass = "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500";

export function MypageEditPage() {
  const token = useAuthStore((state) => state.accessToken);
  const sessionVersion = useAuthStore((state) => state.sessionVersion);
  return token ? <MemberEditor key={sessionVersion} token={token} sessionVersion={sessionVersion} /> : null;
}

function MemberEditor({ token, sessionVersion }: { token: string; sessionVersion: number }) {
  const member = useMemberQuery(token);
  if (!member.data) {
    return <MemberQueryStatus error={member.error} retry={() => void member.refetch()} />;
  }
  return <NicknameForm profile={member.data} token={token} sessionVersion={sessionVersion} />;
}

function NicknameForm({ profile, token, sessionVersion }: {
  profile: MemberInfo;
  token: string;
  sessionVersion: number;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(profile.nickname);
  const trimmed = nickname.trim();
  const isValid = trimmed.length >= 2 && trimmed.length <= 12;
  const update = useMutation({
    mutationFn: (name: string) => updateMe(token, name),
    onSuccess: async (updated) => {
      const key = memberKey(sessionVersion);
      await queryClient.cancelQueries({ queryKey: key, exact: true });
      if (useAuthStore.getState().sessionVersion !== sessionVersion) return;
      queryClient.setQueryData(key, updated);
      void navigate({ to: "/mypage" });
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isValid && !update.isPending) update.mutate(trimmed);
  }

  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">내 정보 수정</h1>
      <p className="mb-8 text-sm text-zinc-400">닉네임을 수정할 수 있습니다.</p>
      <form onSubmit={submit} className="space-y-7 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <label className="block space-y-2">
          <span>이메일</span>
          <input className={inputClass} value={profile.email} readOnly />
        </label>
        <label className="block space-y-2">
          <span>닉네임</span>
          <input className={inputClass} value={nickname} maxLength={12} disabled={update.isPending}
            onChange={(event) => {
              setNickname(event.target.value);
              if (update.isError) update.reset();
            }} />
          <span className={isValid ? "text-xs text-zinc-400" : "text-xs text-red-400"}>
            닉네임은 2~12자로 입력해 주세요.
          </span>
        </label>
        {update.isError && (
          <p role="alert" className="text-sm text-red-400">
            {apiErrorMessage(update.error, "닉네임을 저장하지 못했어요.")}
          </p>
        )}
        <div className="flex gap-3">
          <Link to="/mypage" disabled={update.isPending}
            className="flex-1 rounded-lg border border-zinc-700 py-3 text-center font-medium hover:bg-zinc-800">
            취소
          </Link>
          <button type="submit" disabled={!isValid || update.isPending}
            className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-40">
            {update.isPending ? "저장 중…" : "저장하기"}
          </button>
        </div>
      </form>
    </>
  );
}
