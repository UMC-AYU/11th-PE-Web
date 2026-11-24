"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { AccountField } from "../../components/account/account-field";
import { AccountPanel } from "../../components/account/account-panel";
import { primaryButtonClass, secondaryButtonClass } from "../../components/account/account-styles";
import { useQuery } from "@tanstack/react-query";
import { meQueryOptions, type MemberInfo } from "../../api/members/me";
import { useAuthStore } from "../../stores/auth-store";
import { RequestError, RequestLoading } from "../../components/movies/request-state";
import { getApiErrorMessage } from "../../api/api-response";
import { useUpdateMeMutation } from "../../hooks/use-update-me-mutation";
import { isValidNickname } from "../auth/account-validation";

export function ProfileEditPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const meQuery = useQuery(meQueryOptions(accessToken));
  if (meQuery.isPending) return <RequestLoading label="내 정보를 불러오는 중이에요." />;
  if (meQuery.isError) return <RequestError title="내 정보를 불러오지 못했어요." message={getApiErrorMessage(meQuery.error)} onRetry={() => void meQuery.refetch()} />;
  return <ProfileEditForm member={meQuery.data} />;
}

function ProfileEditForm({ member: { email, nickname } }: { member: MemberInfo }) {
  const [draft, setDraft] = useState(nickname);
  const router = useRouter();
  const updateMeMutation = useUpdateMeMutation();
  const canSave = isValidNickname(draft) && draft.trim() !== nickname && !updateMeMutation.isPending;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSave) return;

    updateMeMutation.mutate({ nickname: draft.trim() }, {
      onSuccess: () => router.push("/my"),
    });
  }

  return (
    <AccountPanel title="내 정보 수정" description="UMCine에서 사용할 닉네임을 변경할 수 있어요.">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AccountField label="이메일" type="email" value={email} readOnly />
        <AccountField label="닉네임" name="nickname" autoComplete="nickname" required
          disabled={updateMeMutation.isPending}
          value={draft} onChange={(event) => setDraft(event.target.value)}
          error={!isValidNickname(draft) ? "닉네임을 2~12자로 입력해 주세요." : undefined} />
        <div className="flex gap-2">
          {!updateMeMutation.isPending && <Link className={secondaryButtonClass} href="/my">취소</Link>}
          <button className={primaryButtonClass} type="submit" disabled={!canSave}>{updateMeMutation.isPending ? "저장 중" : "저장하기"}</button>
        </div>
        {updateMeMutation.isError && <p role="alert" className="text-sm text-red-700">{getApiErrorMessage(updateMeMutation.error)}</p>}
      </form>
    </AccountPanel>
  );
}
