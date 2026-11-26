import { LoginPage } from "../../../views/auth/login-page";
export const metadata = { title: "로그인" };

export default async function Page({ searchParams }: { searchParams: Promise<{ expired?: string | string[] }> }) {
  const { expired } = await searchParams;
  return <LoginPage expired={expired === "true"} />;
}
