// src/common/api-response.ts
import type { ResponseStatus } from './status.js';

// 성공과 실패 모두 같은 틀로 응답합니다.
// { isSuccess, code, message, result }
export class ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;

  static onSuccess<T>(status: ResponseStatus, result: T): ApiResponse<T> {
    return {
      isSuccess: true,
      code: status.code,
      message: status.message,
      result,
    };
  }

  static onFailure<T = null>(
    status: ResponseStatus,
    result: T = null as T,
    message = status.message,
  ): ApiResponse<T> {
    return { isSuccess: false, code: status.code, message, result };
  }
}

// 검증 실패 시 result에 담기는 필드별 오류입니다.
export type FieldError = {
  field: string;
  message: string;
};
