"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="p-12"><p>화면을 불러오지 못했어요.</p><button type="button" onClick={reset}>다시 시도</button></main>;
}
