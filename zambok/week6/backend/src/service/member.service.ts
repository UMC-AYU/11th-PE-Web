import {
    ConflictException,
    Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { Member } from "../entity/member.entity";
import { CreateMemberDto } from "../dto/create-member.dto";
import { CheckResponseDto } from "../dto/check-response.dto";

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) { }

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

        const existingNickname = await this.memberRepository.exists({
            where: { nickname: dto.nickname },
        });

        if (existingNickname) {
            throw new ConflictException("이미 사용 중인 닉네임입니다.");
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const member = this.memberRepository.create({
            email: dto.email,
            nickname: dto.nickname,
            password: passwordHash,
        });

        const saved = await this.memberRepository.save(member);

        // 비밀번호와 해시는 절대 응답하지 않는다.
        return {
            memberId: saved.memberId,
            email: saved.email,
            nickname: saved.nickname,
        };
    }
}