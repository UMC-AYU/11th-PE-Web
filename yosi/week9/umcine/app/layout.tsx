import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 찾고 평점과 즐겨찾기를 남기는 서비스",
};

// TanStack Router의 __root.tsx(Header + Outlet + Footer)가 Next.js에서는 루트 layout이에요.
// <Outlet /> 자리에 {children}이 들어가요.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
