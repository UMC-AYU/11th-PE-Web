import { ApiProperty } from "@nestjs/swagger";
export class FavoriteStatusResponseDto {
    @ApiProperty({ description: '즐겨찾기 등록 여부', example: false })
    isFavorite!: boolean;
}
