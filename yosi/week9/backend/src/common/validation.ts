// src/common/validation.ts
import {
  BadRequestException,
  ValidationPipe,
  type ValidationError,
} from '@nestjs/common';
import { ErrorStatus } from './status.js';
import type { FieldError } from './api-response.js';

// 중첩된 검증 오류까지 펼쳐서 { field, message } 목록으로 바꿉니다.
function toFieldErrors(errors: ValidationError[], parent = ''): FieldError[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.entries(error.constraints ?? {}).map(
      ([constraint, message]) => ({
        field,
        // forbidNonWhitelisted 오류는 기본 메시지가 영어라서 바꿔 줍니다.
        message:
          constraint === 'whitelistValidation'
            ? `${field}은(는) 보낼 수 없는 값입니다.`
            : message,
      }),
    );
    return [...own, ...toFieldErrors(error.children ?? [], field)];
  });
}

export function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true, // DTO에 없는 필드는 제거
    forbidNonWhitelisted: true, // DTO에 없는 필드가 오면 400 오류
    transform: true, // 요청 값을 DTO 클래스로 변환 (@Transform 적용)
    // 검증 실패 이유를 필드별로 모아 result에 담습니다.
    exceptionFactory: (errors) =>
      new BadRequestException({
        ...ErrorStatus.BAD_REQUEST,
        result: toFieldErrors(errors),
      }),
  });
}
