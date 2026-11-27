"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatusMessage } from "@/components/common/status-message";
import { useAuthHydrated, useAuthStore } from "@/stores/auth-store";

// (auth) 폴더는 주소에 나타나지 않는 Route Group이에요. (/me, /me/edit 그대로)
// 이 폴더의 페이지는 모두 이 layout을 거쳐서, 로그인 검사를 한곳에서 해요.
//
// TanStack Router에서는 beforeLoad에서 토큰을 확인했어요.
// 토큰은 브라우저의 localStorage에만 있어서 서버는 로그인 여부를 몰라요.
// 그래서 Client Component로 만들고, 토큰을 다 읽은 뒤에 검사해요.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthHydrated();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // 토큰을 다 읽었는데 없으면 로그인 페이지로 보내요. (뒤로 가기로 돌아오지 않게 replace)
    if (hasHydrated && !accessToken) router.replace("/login");
  }, [hasHydrated, accessToken, router]);

  if (!hasHydrated || !accessToken) {
    return (
      <main>
        <StatusMessage>로그인 상태를 확인하는 중이에요.</StatusMessage>
      </main>
    );
  }

  return <>{children}</>;
}
