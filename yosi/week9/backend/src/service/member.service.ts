// src/service/member.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import {
  EmailAvailabilityResponseDto,
  NicknameAvailabilityResponseDto,
} from '../dto/member.dto.js';
import {
  CreateMemberDto,
  MemberResponseDto,
} from '../dto/create-member.dto.js';
import {
  MyProfileResponseDto,
  UpdateMyProfileDto,
} from '../dto/my-profile.dto.js';
import { ErrorStatus } from '../common/status.js';

// bcrypt 해시 강도입니다. 숫자가 클수록 안전하지만 느려집니다.
const PASSWORD_SALT_ROUNDS = 10;

@Injectable()
export class MemberService {
  // 별도 Repository 클래스 없이 TypeORM이 제공하는 Repository<Member>를 바로 주입받습니다.
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async signUp(request: CreateMemberDto): Promise<MemberResponseDto> {
    // 1. 중복 확인: 이메일과 닉네임은 UNIQUE라서 저장 전에 먼저 확인합니다.
    if (await this.memberRepository.existsBy({ email: request.email })) {
      throw new ConflictException(ErrorStatus.EMAIL_ALREADY_EXISTS);
    }
    if (await this.memberRepository.existsBy({ nickname: request.nickname })) {
      throw new ConflictException(ErrorStatus.NICKNAME_ALREADY_EXISTS);
    }

    // 2. 비밀번호는 원문 그대로 저장하지 않고 bcrypt 해시(60자)로 바꿔서 저장합니다.
    const password = await bcrypt.hash(request.password, PASSWORD_SALT_ROUNDS);

    // 3. 저장 후 비밀번호를 뺀 응답 DTO로 바꿔서 돌려줍니다.
    //    동시에 같은 이메일로 가입하면 DB UNIQUE 제약에서 막히고, 예외 필터가 409로 바꿔 줍니다.
    const member = await this.memberRepository.save(
      this.memberRepository.create({
        email: request.email,
        password,
        nickname: request.nickname,
      }),
    );
    return MemberResponseDto.from(member);
  }

  async checkNickname(
    nickname: string,
  ): Promise<NicknameAvailabilityResponseDto> {
    // 회원 정보 전체를 가져오지 않고 존재 여부만 확인합니다.
    const exists = await this.memberRepository.existsBy({ nickname });
    return { nickname, available: !exists };
  }

  async checkEmail(email: string): Promise<EmailAvailabilityResponseDto> {
    const exists = await this.memberRepository.existsBy({ email });
    return { email, available: !exists };
  }

  // 내 정보 조회: memberId는 요청이 아니라 토큰에서 꺼낸 값입니다.
  async getMyProfile(memberId: number): Promise<MyProfileResponseDto> {
    const member = await this.findMemberOrThrow(memberId);
    return MyProfileResponseDto.from(member);
  }

  // 내 정보 수정: 지금은 닉네임만 바꿀 수 있습니다.
  async updateMyProfile(
    memberId: number,
    request: UpdateMyProfileDto,
  ): Promise<MyProfileResponseDto> {
    const member = await this.findMemberOrThrow(memberId);

    // 지금 닉네임과 같으면 바꿀 것이 없으니 그대로 돌려줍니다.
    if (member.nickname === request.nickname) {
      return MyProfileResponseDto.from(member);
    }

    // 다른 회원이 쓰는 닉네임이면 409
    if (await this.memberRepository.existsBy({ nickname: request.nickname })) {
      throw new ConflictException(ErrorStatus.NICKNAME_ALREADY_EXISTS);
    }

    member.nickname = request.nickname;
    const updated = await this.memberRepository.save(member);
    return MyProfileResponseDto.from(updated);
  }

  // 토큰은 유효하지만 그 사이 회원이 삭제됐을 수 있어서 한 번 더 확인합니다.
  private async findMemberOrThrow(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new NotFoundException(ErrorStatus.MEMBER_NOT_FOUND);
    }
    return member;
  }
}
