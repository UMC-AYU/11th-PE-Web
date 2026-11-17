import type { FavoriteResponseDto } from "./favorite-response.dto";
import type { RatingResponseDto } from "./rating-response.dto";

export class MovieRecordResponseDto {
    rating!: RatingResponseDto;
    favorite!: FavoriteResponseDto | null;
}
