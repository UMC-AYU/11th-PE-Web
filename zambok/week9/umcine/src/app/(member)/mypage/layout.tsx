import Link from "next/link";
import type { ReactNode } from "react";
import { AuthGuard } from "../../../components/auth-guard";

export default function MemberLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-10 inline-block text-xl font-bold text-blue-400">UMCine</Link>
        <AuthGuard>{children}</AuthGuard>
      </div>
    </main>
  );
}
