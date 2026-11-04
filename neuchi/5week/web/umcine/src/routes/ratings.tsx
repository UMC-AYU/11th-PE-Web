import { createFileRoute } from "@tanstack/react-router";
import { RatingsPage } from "../pages/ratings-page";

export const Route = createFileRoute("/ratings")({
  component: RatingsPage,
});
