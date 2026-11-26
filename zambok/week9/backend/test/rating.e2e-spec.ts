import request from "supertest";
import { Rating } from "../src/entity/rating.entity";
import { createTestApp, type TestApp } from "./support/test-app";

describe("평점 HTTP 통합 테스트", () => {
  let context: TestApp;
  beforeEach(async () => { context = await createTestApp(); });
  afterEach(async () => { await context?.close(); });

  it("토큰 없이 평점을 등록하면 401과 AUTH401_2를 반환한다", async () => {
    const response = await request(context.app.getHttpServer()).post("/ratings")
      .send({ movieId: 550, score: 5, comment: "테스트 한줄평" }).expect(401);
    expect(response.body).toMatchObject({ isSuccess: false, code: "AUTH401_2", result: null });
    expect(await context.dataSource.getRepository(Rating).count()).toBe(0);
  });

  it("유효한 JWT와 요청 본문으로 평점을 등록하면 201과 저장된 평점을 반환한다", async () => {
    const response = await request(context.app.getHttpServer()).post("/ratings")
      .auth(context.token, { type: "bearer" }).send({ movieId: 550, score: 5, comment: "테스트 한줄평" }).expect(201);
    expect(response.body).toMatchObject({ isSuccess: true, code: "COMMON201", result: {
      ratingId: expect.any(Number), movieId: 550, score: 5, comment: "테스트 한줄평", createdAt: expect.any(String), updatedAt: expect.any(String),
    } });
    expect(await context.dataSource.getRepository(Rating).count()).toBe(1);
  });
});
