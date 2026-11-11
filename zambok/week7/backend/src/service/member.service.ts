import {
    ConflictException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { Member } from "../entity/member.entity";
import { CreateMemberDto } from "../dto/create-member.dto";
import { CheckResponseDto } from "../dto/check-response.dto";
import { MemberInfoResponseDto } from "../dto/member-info-response.dto";
import { UpdateMemberDto } from "../dto/update-member.dto";
import { ApiException } from "../exception/api.exception";
import { isDuplicateKey } from "../exception/mysql-error";

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) { }

    async getMe(memberId: number): Promise<MemberInfoResponseDto> {
        return MemberInfoResponseDto.from(await this.findMemberInfo(memberId));
    }

    async updateMe(memberId: number, dto: UpdateMemberDto): Promise<MemberInfoResponseDto> {
        const member = await this.findMemberInfo(memberId);

        if (member.nickname === dto.nickname) {
            return MemberInfoResponseDto.from(member);
        }

        const nicknameTaken = await this.memberRepository.exists({
            where: { nickname: dto.nickname, memberId: Not(memberId) },
        });

        if (nicknameTaken) {
            throw this.nicknameConflict();
        }

        try {
            const updated = await this.memberRepository.update(memberId, {
                nickname: dto.nickname,
            });

            if (updated.affected === 0) {
                throw this.memberNotFound();
            }
        } catch (error) {
            if (isDuplicateKey(error)) {
                throw this.nicknameConflict();
            }
            throw error;
        }

        member.nickname = dto.nickname;
        return MemberInfoResponseDto.from(member);
    }

    private async findMemberInfo(memberId: number): Promise<Member> {
        const member = await this.memberRepository.findOne({
            where: { memberId },
            select: { memberId: true, email: true, nickname: true, createdAt: true },
        });

        if (!member) {
            throw this.memberNotFound();
        }

        return member;
    }

    private memberNotFound(): ApiException {
        return new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1", "존재하지 않는 유저입니다.");
    }

    private nicknameConflict(): ApiException {
        return new ApiException(HttpStatus.CONFLICT, "MEMBER409_1", "이미 사용 중인 닉네임입니다.");
    }

    async checkNickname(nickname: string): Promise<CheckResponseDto> {
        const exists = await this.memberRepository.exists({
            where: { nickname },
        });
        return { available: !exists };
    }

    async checkEmail(email: string): Promise<CheckResponseDto> {
        const exists = await this.memberRepository.exists({
            where: { email },
        });
        return { available: !exists };
    }

    async signUp(dto: CreateMemberDto) {
        const existingEmail = await this.memberRepository.exists({
            where: { email: dto.email },
        });

        if (existingEmail) {
            throw new ConflictException("이미 사용 중인 이메일입니다.");
        }

        if (!(await this.checkNickname(dto.nickname)).available) {
            throw this.nicknameConflict();
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const member = this.memberRepository.create({
            email: dto.email,
            nickname: dto.nickname,
            password: passwordHash,
        });

        try {
            const saved = await this.memberRepository.save(member);

            // 비밀번호와 해시는 절대 응답하지 않는다.
            return {
                memberId: saved.memberId,
                email: saved.email,
                nickname: saved.nickname,
            };
        } catch (error) {
            if (isDuplicateKey(error) && !(await this.checkNickname(dto.nickname)).available) {
                throw this.nicknameConflict();
            }
            throw error;
        }
    }
}
