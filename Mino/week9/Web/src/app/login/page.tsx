import type { Metadata } from "next";
import { LoginPage } from "../../screens/auth/login-page";
import { AuthGuard } from "../../components/account/auth-guard";

export const metadata: Metadata = { title: "로그인" };

export default function LoginRoute() {
  return <AuthGuard mode="guest"><LoginPage /></AuthGuard>;
}
