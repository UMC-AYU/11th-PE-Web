import { ApiProperty } from "@nestjs/swagger";
import type { Favorite } from "../entity/favorite.entity";

export class FavoriteResponseDto {
    @ApiProperty({ description: '즐겨찾기 ID', example: 1 })
    favoriteId!: number;
    @ApiProperty({ description: 'TMDB 영화 ID', example: 550 })
    movieId!: number;
    @ApiProperty({ description: '등록 일시', type: String, format: 'date-time', example: '2026-11-25T12:00:00.000Z' })
    createdAt!: Date;

    static from(favorite: Favorite): FavoriteResponseDto {
        return {
            favoriteId: favorite.favoriteId,
            movieId: favorite.movieId,
            createdAt: favorite.createdAt,
        };
    }
}
