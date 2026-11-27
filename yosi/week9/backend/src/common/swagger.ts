// src/common/swagger.ts
import { applyDecorators } from '@nestjs/common';
// 우리 공통 응답 클래스 ApiResponse와 이름이 겹쳐서 별칭으로 가져옵니다.
import { ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { ErrorStatus, type ResponseStatus } from './status.js';

// 문서의 응답 예시를 status.ts의 코드·메시지로 만들어서, 문서와 실제 응답이 어긋나지 않게 합니다.
const body = (isSuccess: boolean, status: ResponseStatus, result: unknown) => ({
  isSuccess,
  code: status.code,
  message: status.message,
  result,
});

// 성공 응답 예시: @ApiSuccess(SuccessStatus.LOGIN_SUCCEEDED, { nickname: '영화광', ... })
export function ApiSuccess(status: ResponseStatus, result: unknown) {
  return SwaggerResponse({
    status: status.httpStatus,
    description: status.message,
    content: { 'application/json': { example: body(true, status, result) } },
  });
}

// 실패 응답 예시: 같은 상태 코드에 여러 경우가 있으면 드롭다운으로 골라 볼 수 있게 묶습니다.
// 예: @ApiFailure('이미 사용 중인 값', ErrorStatus.EMAIL_ALREADY_EXISTS, ErrorStatus.NICKNAME_ALREADY_EXISTS)
export function ApiFailure(description: string, ...statuses: ResponseStatus[]) {
  const examples = Object.fromEntries(
    statuses.map((status) => [
      status.code,
      {
        summary: `${status.code} ${status.message}`,
        value: body(false, status, null),
      },
    ]),
  );
  return SwaggerResponse({
    status: statuses[0].httpStatus,
    description,
    content: { 'application/json': { examples } },
  });
}

// 검증 실패(400) 예시: result에 필드별 실패 이유가 담깁니다.
export function ApiValidationFailure(
  ...fieldErrors: { field: string; message: string }[]
) {
  return SwaggerResponse({
    status: ErrorStatus.BAD_REQUEST.httpStatus,
    description: '입력값 검증 실패 (result에 필드별 실패 이유)',
    content: {
      'application/json': {
        example: body(false, ErrorStatus.BAD_REQUEST, fieldErrors),
      },
    },
  });
}

// 토큰이 필요한 API에 공통으로 붙는 401 응답 (토큰 없음 / 잘못되거나 만료된 토큰)
export function ApiAuthFailure() {
  return applyDecorators(
    ApiFailure(
      '토큰이 없거나 잘못됨',
      ErrorStatus.TOKEN_MISSING,
      ErrorStatus.TOKEN_INVALID,
    ),
  );
}
