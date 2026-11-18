import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_form")({
  component: () => {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 text-white">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
          <Link to="/" className="mb-8 block text-2xl font-bold text-blue-400">
            UMCine
          </Link>
          <Outlet />
        </div>
      </main>
    );
  },
});
