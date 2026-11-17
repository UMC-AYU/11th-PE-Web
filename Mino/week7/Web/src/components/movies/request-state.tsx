interface RequestErrorProps {
  message?: string;
  onRetry: () => void;
}

function RequestLoading({ label = "영화 정보를 불러오는 중이에요." }) {
  return (
    <div className="grid min-h-[360px] place-items-center text-center" role="status">
      <div>
        <span className="mx-auto mb-4 block size-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e88ff]" />
        <p className="text-sm font-bold text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function RequestError({ message, onRetry }: RequestErrorProps) {
  return (
    <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-red-200 bg-white/70 px-4 text-center" role="alert">
      <div>
        <p className="text-base font-extrabold text-slate-700">영화 정보를 불러오지 못했어요.</p>
        <p className="mt-1 text-sm text-slate-400">{message || "잠시 후 다시 시도해 주세요."}</p>
        <button className="mt-5 cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-[#1e88ff]" type="button" onClick={onRetry}>
          다시 시도
        </button>
      </div>
    </div>
  );
}

export { RequestError, RequestLoading };
