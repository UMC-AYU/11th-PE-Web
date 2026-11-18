import { createFileRoute } from "@tanstack/react-router";
import { MypagePage } from "../../../pages/mypage/mypage-page";

export const Route = createFileRoute("/(member)/mypage/")({
  component: MypagePage,
});