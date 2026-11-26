import { ApiProperty } from "@nestjs/swagger";
import { Rating } from "../entity/rating.entity";

export class RatingResponseDto {
    @ApiProperty({ description: '평점 ID', example: 1 })
    ratingId: number;
    @ApiProperty({ description: 'TMDB 영화 ID', example: 550 })
    movieId: number;
    @ApiProperty({ description: '평점', example: 5 })
    score: number;
    @ApiProperty({ description: '한줄평', type: String, nullable: true, example: '인상적인 영화였어요.' })
    comment: string | null;
    @ApiProperty({ description: '등록 일시', type: String, format: 'date-time' })
    createdAt: Date;
    @ApiProperty({ description: '수정 일시', type: String, format: 'date-time' })
    updatedAt: Date;

    static from(rating: Rating): RatingResponseDto {
        return {
            ratingId: rating.ratingId,
            movieId: rating.movieId,
            score: rating.score,
            comment: rating.comment,
            createdAt: rating.createdAt,
            updatedAt: rating.updatedAt,
        };
    }
}