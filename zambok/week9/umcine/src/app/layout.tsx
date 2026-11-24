import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import Header from "../components/layout/header";
import { TmdbAttribution } from "../components/layout/tmdb-attribution";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "UMCine", template: "%s | UMCine" },
  description: "영화를 찾고 나만의 평점과 북마크를 기록하세요.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="ko"><body><Providers><Header />{children}<TmdbAttribution /></Providers></body></html>;
}
