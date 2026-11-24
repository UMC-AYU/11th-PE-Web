import { ApiProperty } from "@nestjs/swagger";
import { FavoriteResponseDto } from "./favorite-response.dto";
import { RatingResponseDto } from "./rating-response.dto";

export class MovieRecordResponseDto {
    @ApiProperty({ description: '등록된 평점', type: () => RatingResponseDto })
    rating!: RatingResponseDto;
    @ApiProperty({ description: '등록된 즐겨찾기 (미선택 시 null)', type: () => FavoriteResponseDto, nullable: true })
    favorite!: FavoriteResponseDto | null;
}
