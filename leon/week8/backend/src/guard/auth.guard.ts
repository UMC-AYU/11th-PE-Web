import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ') || !header.slice(7).trim()) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'AUTH401_2', '로그인이 필요한 요청입니다.');
    }
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(header.slice(7));
      const memberId = Number(payload.sub);
      if (!Number.isSafeInteger(memberId) || memberId < 1) throw new Error('Invalid subject');
      request.memberId = memberId;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ApiException(HttpStatus.UNAUTHORIZED, 'AUTH401_4', '토큰이 만료되었습니다. 다시 로그인해주세요.');
      }
      throw new ApiException(HttpStatus.UNAUTHORIZED, 'AUTH401_3', '유효하지 않은 토큰입니다.');
    }
    return true;
  }
}
