// 개발자 도구의 Network 탭을 연 뒤 콘솔에서 이 함수를 호출해 요청/응답을 확인하세요.
export async function fetchPopularMoviesOnce() {
    const baseUrl = import.meta.env.VITE_TMDB_API_BASE_URL?.replace(/\/+$/, "");
    const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();
    if (!baseUrl || !token || token === "발급받은_API_READ_ACCESS_TOKEN") {
        throw new Error("TMDB API 토큰을 .env.local에 설정해 주세요.");
    }

    const response = await fetch(`${baseUrl}/movie/popular?language=ko-KR&page=1`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const body = await response.json();
    if (!response.ok) throw new Error(`TMDB 요청 실패: ${response.status}`);
    return body;
}
