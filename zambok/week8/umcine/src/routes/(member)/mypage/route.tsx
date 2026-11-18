import { createFileRoute, Link, Navigate, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth-store";

export const Route = createFileRoute("/(member)/mypage")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login", replace: true });
    }
  },
  component: function MemberLayout() {
    const token = useAuthStore((state) => state.accessToken);

    if (!token) return <Navigate to="/login" search={{ expired: true }} replace />;

    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-2xl">
          <Link to="/" className="mb-10 inline-block text-xl font-bold text-blue-400">
            UMCine
          </Link>
          <Outlet />
        </div>
      </main>
    );
  },
});
