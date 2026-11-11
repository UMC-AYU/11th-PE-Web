interface LoadStateProps {
    message: string;
    onRetry?: () => void;
    loading?: boolean;
}

export function LoadState({ message, onRetry, loading = false }: LoadStateProps) {
    return (
        <div className="grid min-h-72 place-content-center gap-4 text-center" role={loading ? "status" : "alert"}>
            <p className="text-base font-semibold text-[#69717e]">{message}</p>
            {onRetry && (
                <button className="mx-auto rounded-lg bg-[#2f6ce5] px-5 py-2 text-sm font-bold text-white" onClick={onRetry} type="button">
                    다시 시도
                </button>
            )}
        </div>
    );
}
