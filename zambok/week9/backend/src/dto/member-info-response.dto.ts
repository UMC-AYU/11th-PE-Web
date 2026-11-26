import { ApiProperty } from "@nestjs/swagger";
import type { Member } from "../entity/member.entity";

export class MemberInfoResponseDto {
    @ApiProperty({ description: '회원 이메일', example: 'member@example.com' })
    email!: string;
    @ApiProperty({ description: '회원 닉네임', example: '잠복' })
    nickname!: string;
    @ApiProperty({ description: '가입 일시', type: String, format: 'date-time', example: '2026-11-25T12:00:00.000Z' })
    createdAt!: Date;

    static from(member: Member): MemberInfoResponseDto {
        return {
            email: member.email,
            nickname: member.nickname,
            createdAt: member.createdAt,
        };
    }
}
