import { createFileRoute } from "@tanstack/react-router";
import { EditPage } from "../../../../pages/account/edit-page";

export const Route = createFileRoute("/(authenticated)/_auth/account/edit")({ component: EditPage });
