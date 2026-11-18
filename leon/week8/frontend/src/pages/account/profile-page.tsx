import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getFavorites } from "../../api/favorites";
import { getMe } from "../../api/members/me";
import { getMovieDetail } from "../../api/tmdb";

export function ProfilePage() {
    const meQuery = useQuery({ queryKey: ["members", "me"], queryFn: getMe, staleTime: 5 * 60 * 1000 });
    const favoritesQuery = useQuery({ queryKey: ["favorites"], queryFn: getFavorites, retry: false });
    const favorites = favoritesQuery.data ?? [];
    const movieQueries = useQueries({
        queries: favorites.map((id) => ({
            queryKey: ["movies", "detail", id], queryFn: () => getMovieDetail(id), staleTime: 60 * 1000,
        })),
    });
    const profile = meQuery.data;

    return (
        <main className="flex-1 px-4 py-12 max-sm:py-8">
            <div className="mx-auto max-w-[880px]">
                <p className="mb-2 text-sm font-bold text-[#2f6ce5]">MY PAGE</p>
                <h1 className="mb-2 text-[34px] font-extrabold tracking-[-1.5px]">마이페이지</h1>
                <p className="mb-8 text-sm text-[#69717e]">내 정보와 즐겨찾는 영화를 확인해 보세요.</p>

                <section className="overflow-hidden rounded-2xl border border-[#e6e9ee] bg-white" aria-label="프로필 정보">
                    <div className="flex flex-wrap items-center gap-5 border-b border-[#edf0f3] px-8 py-7 max-sm:px-5">
                        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-[#e9f0ff] text-2xl font-extrabold text-[#2f6ce5]" aria-hidden="true">{profile?.nickname.trim().charAt(0) || "U"}</div>
                        <div className="min-w-0 flex-1">
                            <h2 className="text-xl font-extrabold">{profile?.nickname ?? "불러오는 중…"}</h2>
                            <p className="mt-1 break-all text-sm text-[#69717e]">{profile?.email}</p>
                        </div>
                        <Link to="/account/edit" className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe3e8] px-4 text-sm font-bold hover:bg-[#f7f8fa]"><img src="/icons/edit.svg" alt="" className="size-4 opacity-70" />정보 수정</Link>
                    </div>
                    <dl className="grid gap-y-7 px-8 py-8 max-sm:px-5">
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">닉네임</dt><dd className="text-sm font-semibold">{profile?.nickname}</dd></div>
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">이메일</dt><dd className="break-all text-sm font-semibold">{profile?.email}</dd></div>
                        <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-4 max-sm:grid-cols-1 max-sm:gap-1"><dt className="text-sm font-semibold text-[#8a929f]">가입일</dt><dd className="text-sm font-semibold">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("ko-KR") : "-"}</dd></div>
                    </dl>
                </section>

                <section className="mt-10" aria-labelledby="favorite-title">
                    <h2 id="favorite-title" className="mb-4 text-xl font-extrabold">즐겨찾기 <span className="text-[#2f6ce5]">{favorites.length}</span></h2>
                    {favoritesQuery.isPending ? <p className="text-sm text-[#69717e]">즐겨찾기를 불러오는 중이에요.</p>
                        : favoritesQuery.isError ? <div role="alert" className="text-sm text-[#d54b4b]">즐겨찾기를 불러오지 못했어요. <button type="button" className="underline" onClick={() => void favoritesQuery.refetch()}>다시 시도</button></div>
                        : favorites.length === 0 ? <p className="rounded-xl border border-[#e6e9ee] bg-white p-8 text-sm text-[#69717e]">즐겨찾는 영화가 아직 없어요.</p>
                        : <ul className="grid list-none grid-cols-2 gap-4 p-0 max-sm:grid-cols-1">{favorites.map((id, index) => {
                            const movie = movieQueries[index]?.data;
                            return <li key={id}><Link to="/movies/$movieId" params={{ movieId: String(id) }} className="flex items-center gap-4 rounded-xl border border-[#e6e9ee] bg-white p-3 hover:border-[#2f6ce5]">
                                {movie?.posterPath ? <img src={movie.posterPath} alt="" className="h-20 w-14 rounded object-cover" /> : <span className="grid h-20 w-14 place-items-center rounded bg-[#e9ecf1] text-xs text-[#69717e]">영화</span>}
                                <span className="min-w-0 flex-1 truncate text-sm font-bold">{movie?.title ?? `영화 #${id}`}</span>
                            </Link></li>;
                        })}</ul>}
                </section>
            </div>
        </main>
    );
}
