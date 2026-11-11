import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { CheckResponseDto } from '../dto/check-response.dto';
import { CreateMemberDto } from '../dto/create-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { nickname } });
    return { available: !exists };
  }

  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({ where: { email } });
    return { available: !exists };
  }

  async signUp(dto: CreateMemberDto): Promise<{ memberId: number; email: string; nickname: string }> {
    if (await this.memberRepository.exists({ where: { email: dto.email } })) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }
    if (await this.memberRepository.exists({ where: { nickname: dto.nickname } })) {
      throw new ConflictException('이미 사용 중인 닉네임입니다.');
    }

    try {
      const savedMember = await this.memberRepository.save(this.memberRepository.create({
        email: dto.email,
        password: await bcrypt.hash(dto.password, 10),
        nickname: dto.nickname,
      }));
      return {
        memberId: savedMember.memberId,
        email: savedMember.email,
        nickname: savedMember.nickname,
      };
    } catch (error) {
      if (error instanceof Error && /UNIQUE constraint failed|unique constraint/i.test(error.message)) {
        throw new ConflictException('이미 사용 중인 이메일 또는 닉네임입니다.');
      }
      throw error;
    }
  }
}
