// src/service/rating.service.spec.ts
// [미션] 평점 단위 테스트: RatingService의 "판단"만 확인합니다. (DB 없이 가짜 Repository)
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import { RatingService } from './rating.service.js';

describe('RatingService', () => {
  let ratingService: RatingService;

  // 진짜 DB 대신 들어갈 가짜 Repository입니다.
  const ratingRepository = {
    existsBy: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const me = { memberId: 1, nickname: '영화조아' } as Member;
  const other = { memberId: 2, nickname: '영화광' } as Member;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Rating), useValue: ratingRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    ratingService = module.get(RatingService);
    memberRepository.findOneBy.mockResolvedValue(me);
  });

  it('같은 영화에 평점을 중복 등록하면 409 RATING409_1이 나고, 저장은 시도하지 않는다', async () => {
    // given: 내가 이 영화에 이미 평점을 남긴 상황
    ratingRepository.existsBy.mockResolvedValue(true);

    // when & then
    const promise = ratingService.createRating(me.memberId, {
      movieId: 550,
      score: 5,
    });
    await expect(promise).rejects.toThrow(ConflictException);
    await expect(promise).rejects.toMatchObject({
      response: { code: 'RATING409_1' },
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });

  it('남의 평점을 수정하려 하면 403 RATING403_1이 나고, 저장은 시도하지 않는다', async () => {
    // given: 10번 평점의 주인은 다른 회원(2번)인 상황
    ratingRepository.findOne.mockResolvedValue({
      ratingId: 10,
      movieId: 550,
      score: 5,
      member: other,
    });

    // when & then: 나(1번)는 남의 평점을 고칠 수 없다
    const promise = ratingService.updateRating(me.memberId, 10, { score: 1 });
    await expect(promise).rejects.toThrow(ForbiddenException);
    await expect(promise).rejects.toMatchObject({
      response: { code: 'RATING403_1' },
    });
    expect(ratingRepository.save).not.toHaveBeenCalled();
  });
});
