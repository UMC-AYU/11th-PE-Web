import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/api-test")({
    component: ApiTestPage,
});

type ApiResult = {
    name: string;
    url: string;
    status: number | null;
    data: unknown;
    error?: string;
};

const API_BASE = "http://localhost:3000";

const API_LIST = [
    {
        name: "닉네임 중복 확인",
        path: "/members/nickname/수현",
    },
    {
        name: "이메일 중복 확인",
        path: "/members/email/noco@umc.com",
    },
    {
        name: "회원별 평점 조회",
        path: "/members/1/ratings",
    },
];

function ApiTestPage() {
    const [results, setResults] = useState<ApiResult[]>([]);
    const [loading, setLoading] = useState(false);

    async function runTests() {
        setLoading(true);

        const responses = await Promise.all(
            API_LIST.map(async (api): Promise<ApiResult> => {
                const url = `${API_BASE}${api.path}`;

                try {
                    const response = await fetch(
                        `${API_BASE}${encodeURI(api.path)}`
                    );

                    const data: unknown = await response.json();

                    return {
                        name: api.name,
                        url,
                        status: response.status,
                        data,
                        ...(!response.ok && {
                            error: `HTTP ${response.status}`,
                        }),
                    };
                } catch (error) {
                    return {
                        name: api.name,
                        url,
                        status: null,
                        data: null,
                        error:
                            error instanceof Error
                                ? error.message
                                : "알 수 없는 오류",
                    };
                }
            })
        );

        setResults(responses);
        setLoading(false);
    }

    useEffect(() => {
        void runTests();
    }, []);

    return (
        <main className="min-h-screen bg-gray-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-3 text-3xl font-bold">
                    UMC 5주차 백엔드 API 연동 테스트
                </h1>

                <p className="mb-8 text-gray-400">
                    React + NestJS + MySQL / CORS 연동 검증
                </p>

                <button
                    onClick={() => void runTests()}
                    disabled={loading}
                    className="mb-8 rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
                >
                    {loading ? "API 요청 중..." : "3개 API 다시 호출"}
                </button>

                <div className="space-y-6">
                    {results.map((result) => (
                        <section
                            key={result.name}
                            className="rounded-xl border border-gray-700 bg-gray-900 p-6"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <h2 className="text-xl font-bold">
                                    {result.name}
                                </h2>

                                <span
                                    className={
                                        result.status === 200
                                            ? "font-bold text-green-400"
                                            : "font-bold text-red-400"
                                    }
                                >
                                    {result.status === 200
                                        ? "200 OK"
                                        : result.status
                                            ? `HTTP ${result.status}`
                                            : "요청 실패"}
                                </span>
                            </div>

                            <p className="mb-4 break-all text-sm text-blue-300">
                                GET {result.url}
                            </p>

                            {result.error && (
                                <p className="mb-4 text-red-400">
                                    오류: {result.error}
                                </p>
                            )}

                            <pre className="overflow-x-auto rounded-lg bg-black p-4 text-sm text-green-300">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
}