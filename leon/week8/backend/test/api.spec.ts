import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { Member } from '../src/entity/member.entity';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter';

describe('UMCine mission APIs', () => {
  let app: INestApplication;
  const directory = mkdtempSync(join(tmpdir(), 'umcine-api-test-'));

  beforeAll(async () => {
    process.env.DB_FILE = join(directory, 'test.sqlite');
    process.env.SEED_DEMO_DATA = 'true';
    const { AppModule } = await import('../src/app.module');
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    rmSync(directory, { recursive: true, force: true });
  });

  it('returns nickname availability for existing and new names', async () => {
    const server = app.getHttpServer();
    await request(server).get('/members/nickname/%EC%88%98%ED%98%84').expect(200, { available: false });
    await request(server).get('/members/nickname/%EC%83%88%EB%8B%89%EB%84%A4%EC%9E%84').expect(200, { available: true });
  });

  it('returns email availability for existing and new addresses', async () => {
    const server = app.getHttpServer();
    await request(server).get('/members/email/noco%40umc.com').expect(200, { available: false });
    await request(server).get('/members/email/new%40umc.com').expect(200, { available: true });
  });

  it('returns two ratings newest first and 404 for a missing member', async () => {
    const server = app.getHttpServer();
    const response = await request(server).get('/members/1/ratings').expect(200);
    expect(response.body).toHaveLength(2);
    expect(response.body.map((rating: { ratingId: number }) => rating.ratingId)).toEqual([2, 1]);
    await request(server).get('/members/999/ratings').expect(404);
  });

  it('validates signup, stores a bcrypt hash, and never returns a password', async () => {
    const server = app.getHttpServer();
    const signup = { email: 'umc@example.com', password: 'Umc!1234', nickname: 'moviefan' };
    const created = await request(server).post('/members').send(signup).expect(201);
    expect(created.body.result).toEqual({ memberId: expect.any(Number), email: signup.email, nickname: signup.nickname });
    expect(JSON.stringify(created.body)).not.toContain('password');

    const repository = app.get<Repository<Member>>(getRepositoryToken(Member));
    const stored = await repository.findOne({ where: { email: signup.email }, select: { memberId: true, password: true } });
    expect(stored?.password).not.toBe(signup.password);
    expect(await bcrypt.compare(signup.password, stored!.password!)).toBe(true);

    const duplicate = await request(server).post('/members').send({ ...signup, nickname: 'otherfan' }).expect(409);
    expect(duplicate.body).toEqual({ isSuccess: false, code: 'COMMON409', message: '이미 사용 중인 이메일입니다.', result: null });
    await request(server).post('/members').send({ ...signup, email: 'other@example.com' }).expect(409);

    const invalid = await request(server).post('/members').send({ ...signup, email: 'bad-email' }).expect(400);
    expect(invalid.body).toMatchObject({ isSuccess: false, code: 'COMMON400', result: null });
    await request(server).post('/members').send({ ...signup, email: 'extra@example.com', admin: true }).expect(400);
  });

  it('runs the nine-step authenticated rating scenario', async () => {
    const server = app.getHttpServer();
    const first = await request(server).post('/members').send({ email: 'first@example.com', password: 'Umc!1234', nickname: 'firstfan' }).expect(201);
    const second = await request(server).post('/members').send({ email: 'second@example.com', password: 'Umc!1234', nickname: 'secondfan' }).expect(201);
    const ownerId = first.body.result.memberId as number;
    const loginA = await request(server).post('/auth/login').send({ email: 'first@example.com', password: 'Umc!1234' }).expect(200);
    const loginB = await request(server).post('/auth/login').send({ email: 'second@example.com', password: 'Umc!1234' }).expect(200);
    const tokenA = loginA.body.result.accessToken as string;
    const tokenB = loginB.body.result.accessToken as string;
    expect(tokenA).toBeTruthy();
    expect(tokenB).toBeTruthy();
    const rating = { movieId: 550, score: 5, review: '좋았어요.' };

    const created = await request(server).post('/ratings').auth(tokenA, { type: 'bearer' }).send(rating).expect(201);
    const ratingId = created.body.result.ratingId as number;
    expect(created.body.code).toBe('COMMON201');
    expect(created.body.result).toMatchObject(rating);
    await request(server).post('/ratings').auth(tokenA, { type: 'bearer' }).send(rating).expect(409, {
      isSuccess: false, code: 'RATING409_1', message: '이미 이 영화에 평점을 남기셨습니다.', result: null,
    });
    await request(server).patch(`/ratings/${ratingId}`).auth(tokenA, { type: 'bearer' }).send({ score: 4 }).expect(200);
    const forbidden = await request(server).patch(`/ratings/${ratingId}`).auth(tokenB, { type: 'bearer' }).send({ score: 3 }).expect(403);
    expect(forbidden.body.code).toBe('RATING403_1');
    const unauthenticated = await request(server).patch(`/ratings/${ratingId}`).send({ score: 3 }).expect(401);
    expect(unauthenticated.body.code).toBe('AUTH401_2');
    expect(unauthenticated.body.code).not.toBe(forbidden.body.code);
    const noTokenMe = await request(server).get('/members/me').expect(401);
    expect(noTokenMe.body.code).toBe('AUTH401_2');
    const me = await request(server).get('/members/me').auth(tokenA, { type: 'bearer' }).expect(200);
    expect(me.body.result).toMatchObject({ email: 'first@example.com', nickname: 'firstfan', createdAt: expect.any(String) });
    expect(JSON.stringify(me.body)).not.toContain('password');
    await request(server).patch('/members/me').auth(tokenA, { type: 'bearer' }).send({ nickname: 'firstfan2' }).expect(200);
    await request(server).delete('/ratings/99999').auth(tokenA, { type: 'bearer' }).expect(404, {
      isSuccess: false, code: 'RATING404_1', message: '해당 평점을 찾을 수 없습니다.', result: null,
    });
    const deleted = await request(server).delete(`/ratings/${ratingId}`).auth(tokenA, { type: 'bearer' }).expect(200);
    expect(deleted.body).toMatchObject({ isSuccess: true, code: 'COMMON200', result: null });
    expect((await request(server).get(`/members/${ownerId}/ratings`).expect(200)).body).toHaveLength(0);
  });

  it('keeps favorites private, validates input, and handles duplicates and deletion', async () => {
    const server = app.getHttpServer();
    const credentials = { password: 'Umc!1234' };
    await request(server).post('/members').send({ ...credentials, email: 'favorite-a@example.com', nickname: 'favoritea' }).expect(201);
    await request(server).post('/members').send({ ...credentials, email: 'favorite-b@example.com', nickname: 'favoriteb' }).expect(201);
    const tokenA = (await request(server).post('/auth/login').send({ ...credentials, email: 'favorite-a@example.com' }).expect(200)).body.result.accessToken as string;
    const tokenB = (await request(server).post('/auth/login').send({ ...credentials, email: 'favorite-b@example.com' }).expect(200)).body.result.accessToken as string;

    expect((await request(server).post('/favorites').send({ movieId: 550 }).expect(401)).body.code).toBe('AUTH401_2');
    await request(server).post('/favorites').auth(tokenA, { type: 'bearer' }).send({ movieId: 0 }).expect(400);
    await request(server).post('/favorites').auth(tokenA, { type: 'bearer' }).send({ movieId: 550, memberId: 1 }).expect(400);
    const created = await request(server).post('/favorites').auth(tokenA, { type: 'bearer' }).send({ movieId: 550 }).expect(201);
    expect(created.body.result).toMatchObject({ favoriteId: expect.any(Number), movieId: 550, createdAt: expect.any(String) });
    expect((await request(server).post('/favorites').auth(tokenA, { type: 'bearer' }).send({ movieId: 550 }).expect(409)).body.code).toBe('FAVORITE409_1');
    expect((await request(server).get('/favorites').auth(tokenA, { type: 'bearer' }).expect(200)).body.result).toHaveLength(1);
    expect((await request(server).get('/favorites').auth(tokenB, { type: 'bearer' }).expect(200)).body.result).toEqual([]);
    expect((await request(server).get('/favorites/550').auth(tokenA, { type: 'bearer' }).expect(200)).body.result).toEqual({ isFavorite: true });
    expect((await request(server).get('/favorites/550').auth(tokenB, { type: 'bearer' }).expect(200)).body.result).toEqual({ isFavorite: false });
    expect((await request(server).delete('/favorites/550').auth(tokenB, { type: 'bearer' }).expect(404)).body.code).toBe('FAVORITE404_1');
    await request(server).delete('/favorites/550').auth(tokenA, { type: 'bearer' }).expect(200);
    expect((await request(server).get('/favorites/550').auth(tokenA, { type: 'bearer' }).expect(200)).body.result).toEqual({ isFavorite: false });
  });

  it('saves a movie record atomically and rolls back the rating if favorite insertion fails', async () => {
    const server = app.getHttpServer();
    const credentials = { email: 'record@example.com', password: 'Umc!1234' };
    const memberId = (await request(server).post('/members').send({ ...credentials, nickname: 'recordfan' }).expect(201)).body.result.memberId as number;
    const token = (await request(server).post('/auth/login').send(credentials).expect(200)).body.result.accessToken as string;
    const body = { movieId: 238, score: 5, comment: '다시 보고 싶은 영화입니다.', addToFavorites: true };

    const created = await request(server).post('/movie-records').auth(token, { type: 'bearer' }).send(body).expect(201);
    expect(created.body.result).toMatchObject({
      rating: { movieId: 238, score: 5, comment: body.comment },
      favorite: { movieId: 238 },
    });
    expect((await request(server).post('/movie-records').auth(token, { type: 'bearer' }).send(body).expect(409)).body.code).toBe('RATING409_1');
    expect((await request(server).get('/favorites/238').auth(token, { type: 'bearer' }).expect(200)).body.result.isFavorite).toBe(true);

    const dataSource = app.get(DataSource);
    await dataSource.query("CREATE TRIGGER reject_favorite_test BEFORE INSERT ON favorites WHEN NEW.movie_id = 239 BEGIN SELECT RAISE(ABORT, 'forced favorite failure'); END");
    try {
      await request(server).post('/movie-records').auth(token, { type: 'bearer' }).send({ ...body, movieId: 239 }).expect(500);
      const ratings = (await request(server).get(`/members/${memberId}/ratings`).expect(200)).body as Array<{ movieId: number }>;
      expect(ratings.some((rating) => rating.movieId === 239)).toBe(false);
      expect((await request(server).get('/favorites/239').auth(token, { type: 'bearer' }).expect(200)).body.result.isFavorite).toBe(false);
    } finally {
      await dataSource.query('DROP TRIGGER reject_favorite_test');
    }

    const ratingOnly = await request(server).post('/movie-records').auth(token, { type: 'bearer' }).send({ ...body, movieId: 240, addToFavorites: false }).expect(201);
    expect(ratingOnly.body.result.favorite).toBeNull();
  });
});
