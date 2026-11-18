import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavorite, deleteFavorite, getFavorite, getFavorites } from "../../api/favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
    movieId: number;
    movieTitle: string;
    variant?: "card" | "detail" | "search";
}

export function BookmarkButton({ movieId, movieTitle, variant = "card" }: BookmarkButtonProps) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const listQuery = useQuery({
        queryKey: ["favorites"], queryFn: getFavorites,
        enabled: Boolean(accessToken) && variant !== "detail", retry: false,
    });
    const detailQuery = useQuery({
        queryKey: ["favorites", movieId], queryFn: () => getFavorite(movieId),
        enabled: Boolean(accessToken) && variant === "detail", retry: false,
    });
    const isBookmarked = variant === "detail"
        ? detailQuery.data ?? false
        : listQuery.data?.includes(movieId) ?? false;
    const isLoading = Boolean(accessToken) && (variant === "detail" ? detailQuery.isPending : listQuery.isPending);
    const hasError = Boolean(accessToken) && (variant === "detail" ? detailQuery.isError : listQuery.isError);
    const mutation = useMutation({
        mutationFn: async (add: boolean) => {
            if (add) await addFavorite(movieId);
            else await deleteFavorite(movieId);
        },
        onSuccess: (_, add) => {
            queryClient.setQueryData<boolean>(["favorites", movieId], add);
            queryClient.setQueryData<number[]>(["favorites"], (previous) => {
                if (!previous) return previous;
                return add ? [...new Set([...previous, movieId])] : previous.filter((id) => id !== movieId);
            });
            void queryClient.invalidateQueries({ queryKey: ["favorites"] });
        },
    });

    return <div className={variant === "card" ? "contents" : ""}>
        <button
            className={cn(
                "inline-flex cursor-pointer items-center justify-center gap-2 font-bold transition focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#2f6ce5]/35 disabled:cursor-wait disabled:opacity-60",
                variant === "card" && "absolute top-2 right-2 size-8 rounded-lg border border-white/90 bg-[rgba(19,23,31,0.88)] p-0 sm:top-[11px] sm:right-[11px] sm:size-9",
                variant === "card" && isBookmarked && "border-[#2f6ce5] bg-[#2f6ce5]",
                variant === "detail" && "h-10 rounded-lg bg-[#2f6ce5] px-4 text-sm text-white hover:bg-[#245fd4]",
                variant === "search" && "mt-2 self-start rounded-md border border-[#dce1e8] bg-white px-2.5 py-1.5 text-xs text-[#596170] hover:border-[#2f6ce5]",
                variant === "search" && isBookmarked && "border-[#2f6ce5] text-[#2f6ce5]",
            )}
            type="button"
            aria-label={accessToken ? `${movieTitle} 즐겨찾기 ${isBookmarked ? "해제" : "추가"}` : `${movieTitle} 즐겨찾기, 로그인 필요`}
            aria-pressed={isBookmarked}
            disabled={isLoading || mutation.isPending}
            onClick={() => {
                if (!accessToken) { void navigate({ to: "/login" }); return; }
                if (hasError) {
                    void (variant === "detail" ? detailQuery.refetch() : listQuery.refetch());
                    return;
                }
                mutation.mutate(!isBookmarked);
            }}
        >
            <img className={cn("size-5", variant === "card" && "invert sm:size-6", variant === "detail" && "brightness-0 invert", variant === "search" && "size-4")}
                src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
            {variant !== "card" && <span>{!accessToken ? "로그인 후 즐겨찾기" : hasError ? "다시 시도" : isLoading ? "확인 중…" : mutation.isPending ? "저장 중…" : isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}</span>}
        </button>
        {mutation.isError && variant !== "card" && <p role="alert" className="mt-2 text-xs text-[#d54b4b]">즐겨찾기 변경에 실패했어요.</p>}
    </div>;
}
