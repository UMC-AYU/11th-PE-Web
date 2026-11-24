import request from "supertest";
import { Favorite } from "../src/entity/favorite.entity";
import { createTestApp, type TestApp } from "./support/test-app";

describe("즐겨찾기 HTTP 통합 테스트", () => {
  let context: TestApp;
  beforeEach(async () => { context = await createTestApp(); });
  afterEach(async () => { await context?.close(); });

  it("인증된 즐겨찾기 등록은 201과 저장된 영화 ID를 반환한다", async () => {
    const response = await request(context.app.getHttpServer()).post("/favorites")
      .auth(context.token, { type: "bearer" }).send({ movieId: 550 }).expect(201);
    expect(response.body).toMatchObject({ isSuccess: true, code: "COMMON201", result: { movieId: 550, favoriteId: expect.any(Number), createdAt: expect.any(String) } });
    expect(await context.dataSource.getRepository(Favorite).count()).toBe(1);
  });

  it("중복 즐겨찾기 등록은 409와 FAVORITE409_1을 반환한다", async () => {
    const client = request(context.app.getHttpServer());
    await client.post("/favorites").auth(context.token, { type: "bearer" }).send({ movieId: 550 }).expect(201);
    const response = await client.post("/favorites").auth(context.token, { type: "bearer" }).send({ movieId: 550 });
    expect(await context.dataSource.getRepository(Favorite).count()).toBe(1);
    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ isSuccess: false, code: "FAVORITE409_1", result: null });
    expect(await context.dataSource.getRepository(Favorite).count()).toBe(1);
  });

  it("미등록 영화의 즐겨찾기 조회는 200과 false를 반환한다", async () => {
    const response = await request(context.app.getHttpServer()).get("/favorites/550")
      .auth(context.token, { type: "bearer" }).expect(200);
    expect(response.body).toMatchObject({ isSuccess: true, code: "COMMON200", result: { isFavorite: false } });
  });

  it("Swagger JSON은 토큰 없이 접근 가능하고 실제 15개 API의 인증 구분을 포함한다", async () => {
    const response = await request(context.app.getHttpServer()).get("/swagger-ui-json").expect(200);
    const document = response.body;
    expect(document.info).toMatchObject({ title: "UMCine API", version: "9.0" });
    expect(document.components.securitySchemes["access-token"]).toMatchObject({ type: "http", scheme: "bearer" });
    const publicEndpoints = [["/members", "post"], ["/auth/login", "post"], ["/members/{memberId}/ratings", "get"], ["/members/nickname/{nickname}", "get"], ["/members/email/{email}", "get"]];
    const protectedEndpoints = [["/members/me", "get"], ["/members/me", "patch"], ["/ratings", "post"], ["/ratings/{ratingId}", "patch"], ["/ratings/{ratingId}", "delete"], ["/favorites", "post"], ["/favorites", "get"], ["/favorites/{movieId}", "get"], ["/favorites/{movieId}", "delete"], ["/movie-records", "post"]];
    const operations = Object.values(document.paths).flatMap((item) => Object.keys(item as object).filter((method) => ["get", "post", "patch", "delete"].includes(method)));
    expect(operations).toHaveLength(15);
    for (const [path, method] of publicEndpoints) expect(document.paths[path][method].security ?? []).toEqual([]);
    for (const [path, method] of protectedEndpoints) {
      expect(document.paths[path][method].security).toContainEqual({ "access-token": [] });
      expect(document.paths[path][method].responses["401"]).toBeDefined();
    }
    const duplicateExample = document.paths["/favorites"].post.responses["409"].content["application/json"].examples.FAVORITE409_1.value;
    expect(duplicateExample).toMatchObject({ isSuccess: false, code: "FAVORITE409_1", result: null });
    expect(document.components.schemas.CreateFavoriteDto.properties.movieId.example).toBe(550);
    await request(context.app.getHttpServer()).get("/swagger-ui/").expect(200);
  });
});
