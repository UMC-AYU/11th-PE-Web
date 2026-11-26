import "server-only";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const endpoint = path.join("/");
  if (!/^(movie\/(popular|[1-9]\d*)|search\/movie)$/.test(endpoint)) {
    return NextResponse.json({ message: "지원하지 않는 영화 요청입니다." }, { status: 404 });
  }
  const token = process.env.TMDB_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json({ message: "서버의 TMDB_ACCESS_TOKEN 설정이 필요합니다." }, { status: 503 });
  }
  const upstream = new URL(`https://api.themoviedb.org/3/${endpoint}`);
  for (const key of ["language", "page", "query", "include_adult"]) {
    const value = request.nextUrl.searchParams.get(key);
    if (value !== null) upstream.searchParams.set(key, value);
  }
  try {
    const response = await fetch(upstream, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ message: "영화 서버에 연결하지 못했습니다." }, { status: 502 });
  }
}
