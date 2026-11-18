import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../../../pages/account/profile-page";

export const Route = createFileRoute("/(authenticated)/_auth/account/profile")({ component: ProfilePage });
