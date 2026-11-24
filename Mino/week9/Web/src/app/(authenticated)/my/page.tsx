import type { Metadata } from "next";
import { ProfilePage } from "../../../screens/profile/profile-page";

export const metadata: Metadata = { title: "내 정보" };

export default function MyPage() {
  return <ProfilePage />;
}
