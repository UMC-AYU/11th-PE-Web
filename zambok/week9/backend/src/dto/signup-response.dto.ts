import { ApiProperty } from "@nestjs/swagger";
export class SignupResponseDto {
  @ApiProperty({ description: "회원 ID", example: 1 }) memberId!: number;
  @ApiProperty({ description: "이메일", example: "member@example.com" }) email!: string;
  @ApiProperty({ description: "닉네임", example: "잠복" }) nickname!: string;
}
