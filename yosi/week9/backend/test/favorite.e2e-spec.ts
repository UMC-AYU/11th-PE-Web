// test/favorite.e2e-spec.ts
// [실습 5] 통합 테스트: 진짜 HTTP 요청을 보내서 즐겨찾기 API의 전체 흐름을 확인합니다.
// 인증(Guard), 검증(ValidationPipe), 서비스, DB 저장까지 전부 실제로 동작해요.
//
// 단, 개발용 MySQL을 그대로 쓰면 안 됩니다.
// 테스트를 돌릴 때마다 쓰레기 데이터가 쌓이고, 남은 데이터 때문에 다음 테스트가 실패하기도 하거든요.
// 그래서 테스트가 돌 때만 메모리 위에 잠깐 만들어졌다 사라지는 DB(sql.js)를 씁니다.
import type { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { configureApp } from '../src/app.setup.js';
import { FavoriteController } from '../src/controller/favorite.controller.js';
import { Favorite } from '../src/entity/favorite.entity.js';
import { Member } from '../src/entity/member.entity.js';
import { Rating } from '../src/entity/rating.entity.js';
import { FavoriteService } from '../src/service/favorite.service.js';

describe('즐겨찾기 API (통합 테스트)', () => {
  let app: INestApplication;
  let memberRepository: Repository<Member>;
  let member: Member;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 개발용 MySQL 대신, 테스트가 돌 때만 메모리 위에 만들어지는 DB를 씁니다.
        // 테스트가 끝나면 흔적 없이 사라지므로 개발 DB의 데이터를 건드리지 않습니다.
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          // Member가 Rating과 연결돼 있어서 Rating 엔티티도 함께 등록해야 해요.
          entities: [Member, Favorite, Rating],
          synchronize: true, // 엔티티를 보고 테이블을 만들어줍니다
        }),
        TypeOrmModule.forFeature([Member, Favorite]),
        // 토큰 검사(JwtAuthGuard)에 필요한 JwtService를 테스트용 비밀 키로 등록합니다.
        JwtModule.register({ global: true, secret: 'test-secret' }),
      ],
      // 즐겨찾기 API를 확인하는 데 평점 컨트롤러까지 올릴 필요는 없어서, 필요한 조각만 조립합니다.
      controllers: [FavoriteController],
      providers: [FavoriteService],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 실제 서버(main.ts)와 같은 검증 파이프와 예외 필터를 붙여야 같은 응답이 나와요.
    configureApp(app);
    await app.init();

    // Postman에서 하던 "로그인해서 토큰 받기" 대신, 회원을 직접 만들고 토큰을 직접 발급합니다.
    memberRepository = moduleFixture.get(getRepositoryToken(Member));
    member = await memberRepository.save(
      memberRepository.create({
        email: 'test@umc.com',
        password: 'hashed-password',
        nickname: '영화조아',
      }),
    );
    const jwtService = moduleFixture.get(JwtService);
    const token = jwtService.sign({
      sub: member.memberId,
      email: member.email,
    });
    authorization = `Bearer ${token}`;
  });

  afterAll(async () => {
    await app.close(); // 메모리 DB도 함께 사라집니다.
  });

  it('토큰 없이 즐겨찾기를 등록하면 401과 AUTH401_2를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .send({ movieId: 155 })
      .expect(401);

    expect(response.body.code).toBe('AUTH401_2');
  });

  it('즐겨찾기를 등록하면 201과 movieId를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 155 })
      .expect(201);

    expect(response.body.result.movieId).toBe(155);
  });

  it('같은 영화를 다시 즐겨찾기하면 409와 FAVORITE409_1을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', authorization)
      .send({ movieId: 155 })
      .expect(409);

    expect(response.body.code).toBe('FAVORITE409_1');
  });

  it('즐겨찾기하지 않은 영화의 여부를 조회하면 200과 isFavorite false를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .get('/favorites/550')
      .set('Authorization', authorization)
      .expect(200);

    expect(response.body.result.isFavorite).toBe(false);
  });
});
