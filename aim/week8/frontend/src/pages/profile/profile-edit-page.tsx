import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useProfileStore } from "../../stores/profile-store";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function ProfileEditPage() {
  const profile = useProfileStore();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const [imageUrl, setImageUrl] = useState(profile.imageUrl);
  const [imageError, setImageError] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);

  const trimmedNickname = nickname.trim();
  const isNicknameValid =
    trimmedNickname.length >= 2 && trimmedNickname.length <= 12;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    event.currentTarget.value = "";
    setImageError("");

    if (!file.type.startsWith("image/") || file.size > MAX_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지 파일을 선택해 주세요.");
      return;
    }

    setIsReadingImage(true);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
    };
    reader.onloadend = () => setIsReadingImage(false);
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isNicknameValid || isReadingImage) return;

    profile.updateProfile({ nickname: trimmedNickname, imageUrl });
    void navigate({ to: "/profile" });
  }

  return (
    <main className="bg-gray-100 text-gray-900">
      <div className="mx-auto flex min-h-[calc(100dvh-72px)] max-w-6xl flex-col px-5 py-6 sm:px-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                내 정보 수정
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                닉네임과 프로필 이미지만 변경할 수 있어요.
              </p>
            </div>

            <button
              type="submit"
              disabled={!isNicknameValid || isReadingImage}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              변경사항 저장
            </button>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="flex flex-col items-center text-center md:pt-4">
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="peer sr-only"
                disabled={isReadingImage}
                onChange={handleImageChange}
              />
              <label
                htmlFor="profile-image"
                className="flex cursor-pointer flex-col items-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600"
              >
                <span className="relative grid size-20 place-items-center rounded-full bg-gray-200">
                  <img
                    src={imageUrl ?? "/icons/movie-icons/person.svg"}
                    alt=""
                    className={
                      imageUrl ? "size-full rounded-full object-cover" : "size-9"
                    }
                  />
                  <span className="absolute bottom-0 right-0 grid size-6 place-items-center rounded-full border border-gray-300 bg-white">
                    <img
                      src="/icons/movie-icons/edit.svg"
                      alt=""
                      className="size-3.5"
                    />
                  </span>
                </span>
                <span className="mt-2 text-sm font-semibold">프로필 이미지</span>
                <span className="mt-1 text-xs text-gray-500">
                  선택 사항 · 최대 5MB
                </span>
              </label>
              {imageError && (
                <p role="alert" className="mt-2 text-xs text-red-700">
                  {imageError}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="profile-nickname" className="mb-1 block text-sm font-semibold">
                  닉네임
                </label>
                <div className="flex rounded-md border border-gray-200 bg-white">
                  <input
                    id="profile-nickname"
                    value={nickname}
                    onChange={(event) => setNickname(event.target.value)}
                    aria-invalid={!isNicknameValid}
                    aria-describedby={!isNicknameValid ? "nickname-error" : undefined}
                    className="min-w-0 flex-1 rounded-l-md px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    disabled
                    className="shrink-0 px-3 text-xs font-semibold text-blue-600 disabled:opacity-60"
                  >
                    중복 확인
                  </button>
                </div>
                {!isNicknameValid && (
                  <p id="nickname-error" className="mt-1 text-xs text-red-700">
                    닉네임은 2자 이상 12자 이하로 입력해 주세요.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="profile-email" className="mb-1 block text-sm font-semibold">
                  이메일
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </form>

        <section className="mt-auto pt-16" aria-labelledby="withdraw-title">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red-300 bg-red-50 p-4">
            <div>
              <h2 id="withdraw-title" className="text-sm font-semibold text-red-700">
                회원 탈퇴
              </h2>
              <p className="mt-1 text-xs text-red-700">
                탈퇴하면 작성한 평점, 후기와 즐겨찾기를 복구할 수 없어요.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="rounded-md border border-red-400 bg-white px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-60"
            >
              회원 탈퇴
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}