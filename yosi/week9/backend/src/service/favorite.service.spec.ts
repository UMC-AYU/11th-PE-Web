// src/service/favorite.service.spec.ts
// [실습 4] 단위 테스트: FavoriteService의 "판단"만 확인합니다.
// DB는 필요 없고, Repository 자리에 가짜를 끼워 넣어 "이미 즐겨찾기한 상태"라고 알려주면 됩니다.
// (이 프로젝트는 Jest 대신 Vitest를 써서 jest.fn() 대신 vi.fn()을 씁니다. 동작은 같아요.)
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { FavoriteService } from './favorite.service.js';

describe('FavoriteService', () => {
  let favoriteService: FavoriteService;

  // 진짜 DB 대신 들어갈 가짜 Repository입니다. vi.fn()은 "호출을 기억하는 빈 함수"예요.
  const favoriteRepository = {
    existsBy: vi.fn(),
    save: vi.fn(),
    create: vi.fn(),
  };
  const memberRepository = {
    findOneBy: vi.fn(),
  };

  const member = { memberId: 1, nickname: '영화조아' } as Member;

  beforeEach(async () => {
    vi.clearAllMocks(); // 앞 테스트에서 기억한 호출 기록을 지웁니다.

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        // "Favorite Repository를 달라고 하면 위의 가짜를 주세요"라는 뜻입니다.
        { provide: getRepositoryToken(Favorite), useValue: favoriteRepository },
        { provide: getRepositoryToken(Member), useValue: memberRepository },
      ],
    }).compile();

    favoriteService = module.get(FavoriteService);
  });

  it('존재하지 않는 회원이면 예외가 나고, 저장은 시도조차 하지 않는다', async () => {
    // given: 회원이 없는 상황
    memberRepository.findOneBy.mockResolvedValue(null);

    // when & then: 404 예외가 나고, 저장은 시도조차 하지 않는다
    await expect(favoriteService.create(1, { movieId: 550 })).rejects.toThrow(
      NotFoundException,
    );
    expect(favoriteRepository.save).not.toHaveBeenCalled();
  });

  it('이미 즐겨찾기한 영화면 예외가 나고, 저장은 시도조차 하지 않는다', async () => {
    // given: 같은 회원이 같은 영화를 이미 즐겨찾기 한 상황
    memberRepository.findOneBy.mockResolvedValue(member);
    favoriteRepository.existsBy.mockResolvedValue(true);

    // when & then: 409 FAVORITE409_1 예외가 나고, 저장은 시도조차 하지 않는다
    const promise = favoriteService.create(1, { movieId: 550 });
    await expect(promise).rejects.toThrow(ConflictException);
    await expect(promise).rejects.toMatchObject({
      response: { code: 'FAVORITE409_1' },
    });
    expect(favoriteRepository.save).not.toHaveBeenCalled();
  });
});
