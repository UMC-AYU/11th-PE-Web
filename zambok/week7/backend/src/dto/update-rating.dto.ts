import {
    IsInt,
    IsOptional,
    Max,
    MaxLength,
    Min,
} from "class-validator";

export class UpdateRatingDto {
    @IsInt()
    @Min(1)
    @Max(5)
    score!: number;

    @IsOptional()
    @MaxLength(500)
    comment?: string;
}