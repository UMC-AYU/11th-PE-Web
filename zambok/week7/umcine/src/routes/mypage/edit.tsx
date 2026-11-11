import { createFileRoute } from "@tanstack/react-router";
import { MypageEditPage } from "../../pages/mypage/mypage-edit-page";

export const Route = createFileRoute("/mypage/edit")({
  component: MypageEditPage,
});