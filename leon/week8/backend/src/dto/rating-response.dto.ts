import { Rating } from '../entity/rating.entity';

export class RatingResponseDto {
  ratingId: number;
  movieId: number;
  score: number;
  review: string;
  createdAt: Date;

  static from(rating: Rating): RatingResponseDto {
    return {
      ratingId: rating.ratingId,
      movieId: rating.movieId,
      score: rating.score,
      review: rating.review,
      createdAt: rating.createdAt,
    };
  }
}
