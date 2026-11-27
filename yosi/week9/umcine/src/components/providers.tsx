"use client";

import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useAuthStore } from "@/stores/auth-store";

// Vite의 main.tsx에서 하던 일(QueryClientProvider로 감싸기)을 여기서 해요.
// Provider는 브라우저 상태를 다뤄서 Client Component로 만들고, app/layout.tsx에서 감싸요.
export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient를 파일 맨 위에서 만들면 서버에서 여러 사용자의 요청이 같은 캐시를 나눠 쓰게 돼요.
  // useState 안에서 만들어서 사용자(브라우저)마다 하나씩 갖게 해요.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 창 포커스가 바뀔 때마다 다시 요청하지 않도록 해요.
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  // 브라우저에서 첫 화면을 그린 뒤에 localStorage의 토큰을 읽어요.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
