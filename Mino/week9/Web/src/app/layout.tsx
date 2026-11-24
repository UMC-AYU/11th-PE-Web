import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "../components/layout/header";
import { TmdbAttribution } from "../components/layout/tmdb-attribution";
import { Providers } from "./providers";
import "../index.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "영화를 검색하고 즐겨찾기와 평점을 남겨 보세요.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-[#f5f6f8] text-slate-900 antialiased">
        <Providers>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <TmdbAttribution />
        </Providers>
      </body>
    </html>
  );
}
