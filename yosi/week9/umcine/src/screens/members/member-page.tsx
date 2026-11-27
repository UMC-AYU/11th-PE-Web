"use client";

import { useState } from "react";
import Link from "next/link";
import { checkEmail } from "@/api/members/check-email";
import { checkNickname } from "@/api/members/check-nickname";
import { getMemberRatings } from "@/api/members/get-member-ratings";
import type { MemberRatings } from "@/api/members/models";
import { cn } from "../../utils/cn";
import { formatDate } from "../../utils/format";

type CheckResult = { tone: "success" | "error"; message: string } | null;

function getErrorMessage(error: unknown) {
  // 서버 연결 실패도 api-client가 ApiError로 바꿔서 message에 담아 줘요.
  return error instanceof Error ? error.message : "요청에 실패했어요.";
}

const inputClass =
  "h-10 flex-1 rounded-md border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400";
const buttonClass =
  "rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50";

function ResultText({ result }: { result: CheckResult }) {
  if (!result) return null;
  return (
    <p
      role={result.tone === "error" ? "alert" : "status"}
      className={cn(
        "mt-2 text-sm",
        result.tone === "success" ? "text-blue-600" : "text-red-500",
      )}
    >
      {result.message}
    </p>
  );
}

function AvailabilityCheck({
  label,
  placeholder,
  check,
}: {
  label: string;
  placeholder: string;
  check: (value: string) => Promise<{ available: boolean }>;
}) {
  const [result, setResult] = useState<CheckResult>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("value") ?? "").trim();
    if (!value) {
      setResult({ tone: "error", message: `${label}을 입력해 주세요.` });
      return;
    }

    setIsLoading(true);
    try {
      const response = await check(value);
      setResult(
        response.available
          ? { tone: "success", message: `사용할 수 있는 ${label}이에요.` }
          : { tone: "error", message: `이미 사용 중인 ${label}이에요.` },
      );
    } catch (error) {
      setResult({ tone: "error", message: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-bold">{label} 중복 체크</h2>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <label className="sr-only" htmlFor={`check-${label}`}>
          {label}
        </label>
        <input
          id={`check-${label}`}
          name="value"
          placeholder={placeholder}
          onChange={() => setResult(null)}
          className={inputClass}
        />
        <button type="submit" disabled={isLoading} className={buttonClass}>
          {isLoading ? "확인 중" : "중복 확인"}
        </button>
      </form>
      <ResultText result={result} />
    </section>
  );
}

function MemberRatingList() {
  const [data, setData] = useState<MemberRatings | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const memberId = Number(new FormData(event.currentTarget).get("memberId"));

    setIsLoading(true);
    setErrorMessage(null);
    setData(null);
    try {
      setData(await getMemberRatings(memberId));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 md:col-span-2">
      <h2 className="font-bold">유저별 평점 조회</h2>
      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <label className="sr-only" htmlFor="member-id">
          회원 ID
        </label>
        <input
          id="member-id"
          name="memberId"
          type="number"
          min={1}
          required
          defaultValue={1}
          className={cn(inputClass, "max-w-40")}
        />
        <button type="submit" disabled={isLoading} className={buttonClass}>
          {isLoading ? "불러오는 중" : "평점 조회"}
        </button>
      </form>

      {errorMessage && <ResultText result={{ tone: "error", message: errorMessage }} />}

      {data && (
        <div className="mt-5">
          <p className="text-sm text-gray-500">
            <strong className="text-gray-900">{data.nickname}</strong>님의 평점 {data.ratingCount}개
          </p>
          {data.ratings.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">아직 남긴 평점이 없어요.</p>
          ) : (
            <ul className="mt-3 divide-y divide-gray-100">
              {data.ratings.map((rating) => (
                <li key={rating.ratingId} className="flex items-center gap-4 py-3">
                  <span className="w-20 shrink-0 text-sm text-amber-500" aria-label={`${rating.score}점`}>
                    {"★".repeat(rating.score)}
                    <span className="text-gray-200">{"★".repeat(5 - rating.score)}</span>
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                    {rating.comment ?? <span className="text-gray-400">한줄평 없음</span>}
                  </p>
                  <Link
                    href={`/movies/${rating.movieId}`}
                    className="shrink-0 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    영화 #{rating.movieId}
                  </Link>
                  <span className="shrink-0 text-xs text-gray-400">
                    {formatDate(rating.createdAt.slice(0, 10))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

export function MemberPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">회원 API 확인</h1>
      <p className="mt-2 text-sm text-gray-500">
        직접 만든 백엔드(localhost:8080)를 브라우저 fetch로 호출해요.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <AvailabilityCheck label="닉네임" placeholder="예: yosi" check={checkNickname} />
        <AvailabilityCheck label="이메일" placeholder="예: yosi@umc.com" check={checkEmail} />
        <MemberRatingList />
      </div>
    </main>
  );
}
