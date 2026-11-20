import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

export const Route = createFileRoute("/(authenticated)/_auth")({
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) throw redirect({ to: "/login" });
  },
  component: () => (
    <div className="flex flex-1 flex-col" data-layout="authenticated">
      <Outlet />
    </div>
  ),
});
