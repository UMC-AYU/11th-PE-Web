// src/dto/favorite-response.dto.ts
import { Favorite } from '../entity/favorite.entity.js';

export class FavoriteResponseDto {
  favoriteId: number;
  movieId: number;
  createdAt: Date;

  static from(favorite: Favorite): FavoriteResponseDto {
    return {
      // DB의 BIGINT 값은 TypeORM이 문자열로 돌려줄 수 있어서 숫자로 바꿔서 응답합니다.
      favoriteId: Number(favorite.favoriteId),
      movieId: Number(favorite.movieId),
      createdAt: favorite.createdAt,
    };
  }
}
