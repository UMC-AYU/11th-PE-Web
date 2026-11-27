import { request } from "@/api/api-client";
import type { CreateRatingRequest, Rating } from "./models";

// 평점 등록: POST /ratings → 201
export function createRating(body: CreateRatingRequest) {
  return request<Rating>("ratings", { method: "post", json: body });
}
