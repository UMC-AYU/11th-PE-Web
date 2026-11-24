import type { ReactNode } from "react";

interface AccountPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function AccountPanel({ title, description, children }: AccountPanelProps) {
  return (
    <main className="mx-auto flex w-full max-w-[448px] flex-1 flex-col justify-center px-4 py-10 sm:py-16">
      <section aria-labelledby="account-title">
        <div className="mb-5">
          <h1 id="account-title" className="text-3xl font-extrabold tracking-tight">{title}</h1>
          {description && <p className="mt-2 text-sm text-slate-600">{description}</p>}
        </div>
        {children}
      </section>
    </main>
  );
}
