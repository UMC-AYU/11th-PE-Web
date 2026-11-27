// test/rating.e2e-spec.ts
// [미션] 평점 통합 테스트: 진짜 HTTP 요청으로 토큰 검사부터 DB 저장까지 확인합니다.
// 개발용 MySQL 대신, 테스트가 돌 때만 메모리에 생기는 DB(sql.js)를 씁니다.
import type { INestApplication } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { configureApp } from '../src/app.setup.js';
import { RatingController } from '../src/controller/rating.controller.js';
import { Member } from '../src/entity/member.entity.js';
import { Rating } from '../src/entity/rating.entity.js';
import { RatingService } from '../src/service/rating.service.js';

describe('평점 API (통합 테스트)', () => {
  let app: INestApplication;
  let authorization: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqljs',
          autoSave: false,
          entities: [Member, Rating],
          synchronize: true, // 엔티티를 보고 테이블을 만들어줍니다
        }),
        TypeOrmModule.forFeature([Member, Rating]),
        JwtModule.register({ global: true, secret: 'test-secret' }),
      ],
      // 평점 API를 확인하는 데 필요한 조각만 조립합니다.
      controllers: [RatingController],
      providers: [RatingService],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app); // 실제 서버와 같은 검증 파이프와 예외 필터
    await app.init();

    // 회원을 직접 만들고 토큰을 직접 발급합니다.
    const memberRepository: Repository<Member> = moduleFixture.get(
      getRepositoryToken(Member),
    );
    const member = await memberRepository.save(
      memberRepository.create({
        email: 'rating-test@umc.com',
        password: 'hashed-password',
        nickname: '평점테스트',
      }),
    );
    const token = moduleFixture
      .get(JwtService)
      .sign({ sub: member.memberId, email: member.email });
    authorization = `Bearer ${token}`;
  });

  afterAll(async () => {
    await app.close(); // 메모리 DB도 함께 사라집니다.
  });

  it('토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({ movieId: 550, score: 5 })
      .expect(401);

    expect(response.body.code).toBe('AUTH401_2');
  });

  it('토큰을 담아 평점을 등록하면 201과 저장된 평점을 응답한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', authorization)
      .send({ movieId: 550, score: 5, comment: '오랜 시간이 지나도 좋네요.' })
      .expect(201);

    expect(response.body).toMatchObject({
      isSuccess: true,
      code: 'COMMON201',
      result: { movieId: 550, score: 5, comment: '오랜 시간이 지나도 좋네요.' },
    });
  });
});
