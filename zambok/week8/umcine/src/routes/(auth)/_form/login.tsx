import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "../../../pages/auth/login-page";

export const Route = createFileRoute("/(auth)/_form/login")({
  validateSearch: (search: Record<string, unknown>): { expired?: boolean } =>
    search.expired === true ? { expired: true } : {},
  component: function LoginRoute() {
    const { expired } = Route.useSearch();
    return <LoginPage expired={expired} />;
  },
});
