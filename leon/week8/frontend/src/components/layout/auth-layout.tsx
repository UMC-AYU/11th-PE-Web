import { Navigate, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api/members/me";
import { LoadState } from "../movies/load-state";
import { useAuthStore } from "../../stores/auth-store";

export function AuthLayout() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const meQuery = useQuery({
        queryKey: ["members", "me"], queryFn: getMe,
        enabled: Boolean(accessToken), staleTime: 5 * 60 * 1000, retry: false,
    });

    if (!accessToken) return <Navigate to="/login" />;
    if (meQuery.isPending) return <main className="flex-1"><LoadState message="내 정보를 확인하는 중이에요." loading /></main>;
    if (meQuery.isError) return <main className="flex-1"><LoadState message="내 정보를 불러오지 못했어요." onRetry={() => void meQuery.refetch()} /></main>;
    return <Outlet />;
}
