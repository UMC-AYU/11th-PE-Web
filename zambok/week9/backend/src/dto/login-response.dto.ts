import { ApiProperty } from "@nestjs/swagger";
export class LoginResponseDto {
    @ApiProperty({ description: '회원 닉네임', example: '잠복' })
    nickname!: string;
    @ApiProperty({ description: '로그인 후 발급되는 JWT', example: '<로그인 응답의 accessToken>', readOnly: true })
    accessToken!: string;
}
