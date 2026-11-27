"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Me } from "@/api/members/models";
import { StatusMessage } from "@/components/common/status-message";
import { FormField, inputClass, type Feedback } from "@/components/form/form-field";
import { useMyProfile, useUpdateMyProfile } from "@/hooks/use-my-profile";

export function MyPageEdit() {
  // 로그인 검사는 (auth) Layout Route가 먼저 해요.
  const profileQuery = useMyProfile();

  if (profileQuery.isPending) {
    return (
      <main>
        <StatusMessage>내 정보를 불러오는 중이에요.</StatusMessage>
      </main>
    );
  }

  if (profileQuery.isError) {
    return (
      <main>
        <StatusMessage tone="error">{profileQuery.error.message}</StatusMessage>
      </main>
    );
  }

  // 내 정보를 받은 뒤에 폼을 그려야 입력칸에 지금 값을 채워 넣을 수 있어요.
  return <EditForm me={profileQuery.data} />;
}

function EditForm({ me }: { me: Me }) {
  const router = useRouter();
  const updateMutation = useUpdateMyProfile();
  const [nicknameInput, setNicknameInput] = useState(me.nickname);

  const nickname = nicknameInput.trim();
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  // 바뀐 내용이 있어야 저장할 수 있어요.
  const canSave = isNicknameValid && nickname !== me.nickname && !updateMutation.isPending;

  const nicknameFeedback: Feedback = !isNicknameValid
    ? { tone: "error", message: "닉네임은 2자 이상 12자 이하로 입력해 주세요." }
    : updateMutation.isError
      ? // 다른 회원이 쓰는 닉네임이면 서버가 "이미 사용 중인 닉네임입니다."를 돌려줘요.
        { tone: "error", message: updateMutation.error.message }
      : null;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;

    updateMutation.mutate(
      { nickname },
      // 저장에 성공하면 내 정보 화면으로 돌아가요. 헤더의 닉네임도 함께 바뀌어 있어요.
      { onSuccess: () => router.push("/me") },
    );
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold">내 정보 수정</h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-8 flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-8"
      >
        <FormField
          id="edit-email"
          label="이메일"
          feedback={{ tone: "info", message: "이메일은 바꿀 수 없어요." }}
        >
          <input
            id="edit-email"
            type="email"
            value={me.email}
            disabled
            aria-describedby="edit-email-feedback"
            className={inputClass(null)}
          />
        </FormField>

        <FormField id="edit-nickname" label="닉네임" feedback={nicknameFeedback}>
          <input
            id="edit-nickname"
            autoComplete="nickname"
            maxLength={12}
            value={nicknameInput}
            onChange={(e) => {
              setNicknameInput(e.target.value);
              if (updateMutation.isError) updateMutation.reset();
            }}
            aria-invalid={nicknameFeedback !== null}
            aria-describedby="edit-nickname-feedback"
            className={inputClass(nicknameFeedback)}
          />
        </FormField>

        <div className="mt-2 flex justify-end gap-2">
          <Link
            href="/me"
            className="flex h-11 items-center rounded-md border border-gray-200 px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={!canSave}
            className="h-11 rounded-md bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {updateMutation.isPending ? "저장하는 중..." : "저장하기"}
          </button>
        </div>
      </form>
    </main>
  );
}
