// src/service/favorite.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { CreateFavoriteDto } from '../dto/create-favorite.dto.js';
import { FavoriteResponseDto } from '../dto/favorite-response.dto.js';
import { FavoriteStatusResponseDto } from '../dto/favorite-status-response.dto.js';
import { ErrorStatus } from '../common/status.js';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 즐겨찾기 등록 (POST /favorites)
  async create(
    memberId: number,
    dto: CreateFavoriteDto,
  ): Promise<FavoriteResponseDto> {
    // 토큰은 유효하지만 회원이 삭제됐을 수 있어서 확인합니다.
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new NotFoundException(ErrorStatus.MEMBER_NOT_FOUND);
    }

    // 등록 전에 같은 영화를 이미 즐겨찾기했는지 먼저 검사합니다. → 409 FAVORITE409_1
    // 서버의 사전 검사는 친절한 오류 메시지를 위한 것이고,
    // 동시에 들어온 요청은 DB의 UNIQUE 제약(uk_favorite_member_movie)이 마지막으로 막습니다.
    const exists = await this.favoriteRepository.existsBy({
      member: { memberId },
      movieId: dto.movieId,
    });
    if (exists) {
      throw new ConflictException(ErrorStatus.FAVORITE_ALREADY_EXISTS);
    }

    const favorite = await this.favoriteRepository.save(
      this.favoriteRepository.create({ member, movieId: dto.movieId }),
    );
    return FavoriteResponseDto.from(favorite);
  }

  // 내 즐겨찾기 조회 (GET /favorites): 최근에 등록한 순
  async getMyFavorites(memberId: number): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favoriteRepository.find({
      where: { member: { memberId } },
      order: { createdAt: 'DESC', favoriteId: 'DESC' },
    });
    return favorites.map((favorite) => FavoriteResponseDto.from(favorite));
  }

  // 특정 영화 즐겨찾기 여부 조회 (GET /favorites/{movieId})
  // 즐겨찾기하지 않았어도 오류가 아니라 isFavorite: false로 응답합니다.
  async getStatus(
    memberId: number,
    movieId: number,
  ): Promise<FavoriteStatusResponseDto> {
    const isFavorite = await this.favoriteRepository.existsBy({
      member: { memberId },
      movieId,
    });
    return FavoriteStatusResponseDto.from(isFavorite);
  }

  // 즐겨찾기 해제 (DELETE /favorites/{movieId})
  // 경로가 영화 ID라서 "내가 즐겨찾기한 이 영화"만 찾아서 지웁니다.
  async delete(memberId: number, movieId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOneBy({
      member: { memberId },
      movieId,
    });
    if (!favorite) {
      throw new NotFoundException(ErrorStatus.FAVORITE_NOT_FOUND);
    }
    await this.favoriteRepository.remove(favorite);
  }
}
