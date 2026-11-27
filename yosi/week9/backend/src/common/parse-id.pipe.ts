// src/common/parse-id.pipe.ts
import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { ErrorStatus } from './status.js';

// 경로의 ID를 숫자로 바꿉니다. 숫자가 아니면 검증 실패와 같은 형식으로 400을 돌려줍니다.
// 예: @Param('memberId', parseId('memberId')) memberId: number
export const parseId = (field: string) =>
  new ParseIntPipe({
    exceptionFactory: () =>
      new BadRequestException({
        ...ErrorStatus.BAD_REQUEST,
        result: [{ field, message: `${field}는 숫자로 입력해 주세요.` }],
      }),
  });
