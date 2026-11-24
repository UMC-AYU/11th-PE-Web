import type { ReactNode } from "react";
import { AuthGuard } from "../../components/account/auth-guard";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard mode="authenticated">{children}</AuthGuard>;
}
