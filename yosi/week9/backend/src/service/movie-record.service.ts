// src/service/movie-record.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Favorite } from '../entity/favorite.entity.js';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import {
  CreateMovieRecordRequestDto,
  MovieRecordResponseDto,
} from '../dto/movie-record.dto.js';
import { FavoriteResponseDto } from '../dto/favorite-response.dto.js';
import { RatingResponseDto } from '../dto/rating.dto.js';
import { ErrorStatus } from '../common/status.js';

@Injectable()
export class MovieRecordService {
  // 트랜잭션을 직접 열기 위해 Repository 대신 DataSource를 주입받습니다.
  constructor(private readonly dataSource: DataSource) {}

  // 평점 저장과 즐겨찾기 추가를 하나의 트랜잭션으로 묶습니다.
  // 중간에 하나라도 실패하면 둘 다 저장되지 않습니다. (평점만 남고 즐겨찾기는 빠지는 일이 없음)
  async createMovieRecord(
    memberId: number,
    request: CreateMovieRecordRequestDto,
  ): Promise<MovieRecordResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 트랜잭션 안에서는 반드시 manager로 만든 Repository를 써야 같은 트랜잭션에 묶입니다.
      const memberRepository = manager.getRepository(Member);
      const ratingRepository = manager.getRepository(Rating);
      const favoriteRepository = manager.getRepository(Favorite);

      // 1. 토큰은 유효하지만 회원이 삭제됐을 수 있어서 확인합니다.
      const member = await memberRepository.findOneBy({ memberId });
      if (!member) {
        throw new NotFoundException(ErrorStatus.MEMBER_NOT_FOUND);
      }

      // 2. 한 회원은 영화 하나에 평점을 하나만 남길 수 있습니다.
      const ratingExists = await ratingRepository.existsBy({
        member: { memberId },
        movieId: request.movieId,
      });
      if (ratingExists) {
        throw new ConflictException(ErrorStatus.RATING_ALREADY_EXISTS);
      }

      // 3. 평점 저장
      const rating = await ratingRepository.save(
        ratingRepository.create({
          member,
          movieId: request.movieId,
          score: request.score,
          comment: request.comment ?? null,
        }),
      );

      // 4. 즐겨찾기 추가를 원할 때만 저장합니다.
      //    이미 즐겨찾기한 영화면 새로 만들지 않고 기존 것을 돌려줍니다. (원하는 결과가 이미 이뤄진 상태)
      let favorite: Favorite | null = null;
      if (request.addToFavorites) {
        favorite =
          (await favoriteRepository.findOneBy({
            member: { memberId },
            movieId: request.movieId,
          })) ??
          (await favoriteRepository.save(
            favoriteRepository.create({ member, movieId: request.movieId }),
          ));
      }

      // 여기까지 예외 없이 오면 트랜잭션이 커밋되고, 예외가 나면 3번 평점 저장까지 모두 롤백됩니다.
      return {
        rating: RatingResponseDto.from(rating),
        favorite: favorite ? FavoriteResponseDto.from(favorite) : null,
      };
    });
  }
}
