import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class UpdateMemberDto {
    @IsString()
    @MinLength(2)
    @MaxLength(12)
    @ApiProperty({ description: '변경할 닉네임', example: '새닉네임', minLength: 2, maxLength: 12 })
    nickname!: string;
}
