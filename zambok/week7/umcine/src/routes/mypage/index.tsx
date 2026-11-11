import { createFileRoute } from "@tanstack/react-router";
import { MypagePage } from "../../pages/mypage/mypage-page";

export const Route = createFileRoute("/mypage/")({
  component: MypagePage,
});