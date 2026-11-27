// src/filter/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ApiResponse } from '../common/api-response.js';
import { ErrorStatus, type ResponseStatus } from '../common/status.js';

type ErrorBody = ResponseStatus & { result?: unknown };

// 예외에 담긴 값이 ErrorStatus 형식({ code, message })인지 확인합니다.
function isErrorBody(body: unknown): body is ErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as ErrorBody).code === 'string' &&
    typeof (body as ErrorBody).message === 'string'
  );
}

// 어떤 예외가 나도 { isSuccess: false, code, message, result } 형식으로 응답합니다.
// HttpException뿐 아니라 DB 오류(QueryFailedError)와 예상치 못한 오류까지 받기 위해 @Catch()를 비워 둡니다.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const { status, body } = this.toResponse(exception);
    response.status(status).json(body);
  }

  private toResponse(exception: unknown): {
    status: number;
    body: ApiResponse<unknown>;
  } {
    // 1. 서비스에서 ErrorStatus를 담아 던진 Nest 예외
    //    예: throw new ConflictException(ErrorStatus.EMAIL_ALREADY_EXISTS)
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (isErrorBody(body)) {
        return {
          status: exception.getStatus(),
          body: ApiResponse.onFailure(body, body.result ?? null),
        };
      }
    }

    // 2. DB 제약 조건 위반: 동시에 같은 요청이 들어와 서비스의 사전 확인을 통과한 경우를 대비합니다.
    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as {
        code?: string;
        sqlMessage?: string;
      };
      if (driverError.code === 'ER_DUP_ENTRY') {
        // 예: Duplicate entry 'a@b.com' for key 'member.email' → 키 이름(email)만 꺼내서 판단합니다.
        const key = /for key '(?:\w+\.)?(\w+)'/.exec(
          driverError.sqlMessage ?? '',
        )?.[1];
        if (key === 'email') return this.fail(ErrorStatus.EMAIL_ALREADY_EXISTS);
        if (key === 'nickname')
          return this.fail(ErrorStatus.NICKNAME_ALREADY_EXISTS);
        if (key === 'uk_favorite_member_movie')
          return this.fail(ErrorStatus.FAVORITE_ALREADY_EXISTS);
        if (key === 'uk_rating_member_movie')
          return this.fail(ErrorStatus.RATING_ALREADY_EXISTS);
      }
      if (driverError.code === 'ER_NO_REFERENCED_ROW_2') {
        return this.fail(ErrorStatus.MEMBER_NOT_FOUND);
      }
    }

    // 3. 그 밖의 Nest 기본 예외 (없는 주소, 깨진 JSON 본문 등)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status === HttpStatus.NOT_FOUND)
        return this.fail(ErrorStatus.NOT_FOUND);
      // JSON 형식이 깨진 요청 본문 등
      if (status === HttpStatus.BAD_REQUEST)
        return this.fail(ErrorStatus.BAD_REQUEST);
      return {
        status,
        body: ApiResponse.onFailure({
          httpStatus: status,
          code: `COMMON${status}`,
          message: exception.message,
        }),
      };
    }

    // 4. 예상하지 못한 오류: 내부 정보는 로그에만 남기고 응답에는 노출하지 않습니다.
    this.logger.error(exception);
    return this.fail(ErrorStatus.INTERNAL_SERVER_ERROR);
  }

  private fail(status: ResponseStatus, result: unknown = null) {
    return {
      status: status.httpStatus,
      body: ApiResponse.onFailure(status, result),
    };
  }
}
