import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  getDemoProfile,
  saveDemoProfile,
} from "../../lib/demo-profile";

export function MypageEditPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getDemoProfile);
  const [error, setError] = useState("");

  const nickname = profile.nickname.trim();
  const isNicknameValid = nickname.length >= 2 && nickname.length <= 12;
  const isIntroductionValid = profile.introduction.length <= 200;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isNicknameValid || !isIntroductionValid) {
      setError("입력값을 다시 확인해 주세요.");
      return;
    }

    try {
      saveDemoProfile({
        ...profile,
        nickname,
      });

      void navigate({ to: "/mypage" });
    } catch {
      setError("프로필을 로컬에 저장하지 못했습니다.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-10 inline-block text-xl font-bold text-blue-400">
          UMCine
        </Link>

        <h1 className="mb-2 text-3xl font-bold">내 정보 수정</h1>

        <p className="mb-8 text-sm text-zinc-400">
          닉네임과 소개를 수정할 수 있습니다.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-7 rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
        >
          <div>
            <label htmlFor="profile-email" className="mb-2 block text-sm font-medium">
              이메일
            </label>

            <input
              id="profile-email"
              value={profile.email}
              disabled
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-400"
            />

            <p className="mt-2 text-xs text-zinc-500">
              이번 실습에서는 이메일을 수정하지 않습니다.
            </p>
          </div>

          <div>
            <label htmlFor="profile-nickname" className="mb-2 block text-sm font-medium">
              닉네임
            </label>

            <input
              id="profile-nickname"
              value={profile.nickname}
              onChange={(event) =>
                setProfile((prev) => ({
                  ...prev,
                  nickname: event.target.value,
                }))
              }
              maxLength={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className={`mt-2 text-xs ${isNicknameValid ? "text-zinc-400" : "text-red-400"}`}>
              닉네임은 2~12자로 입력해 주세요.
            </p>
          </div>

          <div>
            <label htmlFor="profile-introduction" className="mb-2 block text-sm font-medium">
              자기소개
            </label>

            <textarea
              id="profile-introduction"
              rows={5}
              value={profile.introduction}
              onChange={(event) =>
                setProfile((prev) => ({
                  ...prev,
                  introduction: event.target.value,
                }))
              }
              maxLength={200}
              placeholder="자기소개를 입력해 주세요."
              className="w-full resize-y rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-right text-xs text-zinc-400">
              {profile.introduction.length} / 200
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-3">
            <Link
              to="/mypage"
              className="flex-1 rounded-lg border border-zinc-700 py-3 text-center font-medium hover:bg-zinc-800"
            >
              취소
            </Link>

            <button
              type="submit"
              disabled={!isNicknameValid || !isIntroductionValid}
              className="flex-1 rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500 disabled:opacity-40"
            >
              저장하기
            </button>
          </div>
        </form>

        <p className="mt-5 text-sm text-zinc-500">
          수정 내용은 브라우저에 임시 저장되며 실제 회원 DB에는 반영되지 않습니다.
        </p>
      </div>
    </main>
  );
}