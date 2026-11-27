// src/auth/login-member.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from './jwt-auth.guard.js';

// JwtAuthGuard가 토큰에서 꺼내 둔 회원 ID를 컨트롤러 파라미터로 받습니다.
// 예: async getMe(@LoginMember() memberId: number)
export const LoginMember = createParamDecorator(
  (_data: unknown, context: ExecutionContext): number =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().memberId,
);
