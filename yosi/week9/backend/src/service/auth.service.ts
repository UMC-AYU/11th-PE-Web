// src/service/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import { LoginRequestDto, LoginResponseDto } from '../dto/login-request.dto.js';
import type { JwtPayload } from '../auth/jwt-payload.js';
import { ErrorStatus } from '../common/status.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    // JwtModule을 global로 등록해서 따로 import 없이 주입받을 수 있습니다.
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    // 1. 이메일로 회원을 찾습니다.
    const member = await this.memberRepository.findOneBy({ email: dto.email });

    // 2. 저장된 해시와 입력한 비밀번호를 비교합니다.
    //    회원이 없을 때와 비밀번호가 틀릴 때 같은 에러를 던져서 가입 여부를 숨깁니다.
    const isPasswordMatched =
      member !== null && (await bcrypt.compare(dto.password, member.password));
    if (!member || !isPasswordMatched) {
      throw new UnauthorizedException(ErrorStatus.LOGIN_FAILED);
    }

    // 3. 통과하면 회원 ID를 담은 Access Token을 만듭니다.
    const payload: JwtPayload = {
      sub: Number(member.memberId),
      email: member.email,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      nickname: member.nickname,
      accessToken,
    };
  }
}
