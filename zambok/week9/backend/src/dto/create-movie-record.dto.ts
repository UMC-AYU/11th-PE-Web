import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";
import { CreateFavoriteDto } from "./create-favorite.dto";

export class CreateMovieRecordDto extends CreateFavoriteDto {
    @IsInt()
    @Min(1)
    @Max(5)
    @ApiProperty({ description: '영화 평점', example: 5, minimum: 1, maximum: 5 })
    score!: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    @ApiProperty({ description: '한줄평', example: '즐겨찾기와 함께 기록합니다.', maxLength: 500, required: false })
    comment?: string;

    @IsBoolean()
    @ApiProperty({ description: '평점과 함께 즐겨찾기 등록 여부', example: true })
    addToFavorites!: boolean;
}
