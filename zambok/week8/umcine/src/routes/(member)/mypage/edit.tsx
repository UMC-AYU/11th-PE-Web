import { createFileRoute } from "@tanstack/react-router";
import { MypageEditPage } from "../../../pages/mypage/mypage-edit-page";

export const Route = createFileRoute("/(member)/mypage/edit")({
  component: MypageEditPage,
});