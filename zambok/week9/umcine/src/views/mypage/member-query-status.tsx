"use client";

import { apiErrorMessage } from "../../api/api-client";

export function MemberQueryStatus({ error, retry }: { error: Error | null; retry: () => void }) {
  if (!error) return <p role="status">회원 정보를 불러오는 중이에요.</p>;

  return (
    <div role="alert" className="space-y-3 text-red-400">
      <p>{apiErrorMessage(error, "회원 정보를 불러오지 못했어요.")}</p>
      <button type="button" onClick={retry} className="rounded bg-zinc-800 px-4 py-2 text-white">
        다시 시도
      </button>
    </div>
  );
}
