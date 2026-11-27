// src/auth/jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { JwtPayload } from './jwt-payload.js';
import { ErrorStatus } from '../common/status.js';

// 토큰을 확인한 뒤 요청 객체에 담아 둘 로그인 회원 정보
export type AuthenticatedRequest = Request & { memberId: number };

// @UseGuards(JwtAuthGuard)를 붙인 API는 컨트롤러에 도착하기 전에 이 검사를 거칩니다.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // 1. Authorization: Bearer {token} 헤더에서 토큰만 꺼냅니다.
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException(ErrorStatus.TOKEN_MISSING);
    }

    // 2. 서명이 맞는지, 만료되지 않았는지 확인합니다.
    //    누군가 토큰 안의 회원 ID를 바꾸면 서명이 맞지 않아 여기서 막힙니다.
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.memberId = Number(payload.sub);
    } catch {
      throw new UnauthorizedException(ErrorStatus.TOKEN_INVALID);
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' && token ? token : undefined;
  }
}
