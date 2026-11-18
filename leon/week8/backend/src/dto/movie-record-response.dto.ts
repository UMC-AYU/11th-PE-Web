import { Rating } from '../entity/rating.entity';
import { FavoriteResponseDto } from './favorite-response.dto';

export class MovieRecordResponseDto {
  rating: {
    ratingId: number;
    movieId: number;
    score: number;
    comment: string;
    createdAt: Date;
  };
  favorite: FavoriteResponseDto | null;

  static of(rating: Rating, favorite: FavoriteResponseDto | null): MovieRecordResponseDto {
    return {
      rating: {
        ratingId: rating.ratingId,
        movieId: rating.movieId,
        score: rating.score,
        comment: rating.review,
        createdAt: rating.createdAt,
      },
      favorite,
    };
  }
}
