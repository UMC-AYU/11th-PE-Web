import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Header } from "@/src/components/layout/header";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMCine",
  description: "영화를 찾고 즐겨찾기와 평점을 기록하는 UMCine",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>

        <footer className="border-t border-gray-200 bg-white px-5 py-6">
          <section
            aria-label="데이터 출처"
            className="mx-auto max-w-[1000px]"
          >
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              데이터 출처
            </h2>
            <a href="https://www.themoviedb.org/">
              <img
                src="/images/logos/tmdb-logo.svg"
                alt="TMDB"
                className="h-auto w-24"
              />
            </a>
            <p className="mt-3 text-xs leading-5 text-gray-600">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </section>
        </footer>
      </body>
    </html>
  );
}