import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Not, Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { CheckResponseDto } from '../dto/check-response.dto';
import { CreateMemberDto } from '../dto/create-member.dto';
import { MemberInfoResponseDto } from '../dto/member-info-response.dto';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto';
import { ApiException } from '../exception/api.exception';

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

  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');
    return MemberInfoResponseDto.from(member);
  }

  async updateMyInfo(memberId: number, dto: MemberUpdateRequestDto): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');
    const duplicate = await this.memberRepository.exists({ where: { nickname: dto.nickname, memberId: Not(memberId) } });
    if (duplicate) throw new ApiException(HttpStatus.CONFLICT, 'MEMBER409_1', '이미 사용 중인 닉네임입니다.');
    member.nickname = dto.nickname;
    try {
      return MemberInfoResponseDto.from(await this.memberRepository.save(member));
    } catch (error) {
      if (error instanceof Error && /UNIQUE constraint failed|unique constraint/i.test(error.message)) {
        throw new ApiException(HttpStatus.CONFLICT, 'MEMBER409_1', '이미 사용 중인 닉네임입니다.');
      }
      throw error;
    }
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
