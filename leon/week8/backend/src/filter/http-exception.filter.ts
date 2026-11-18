import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exception/api.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : null;
    const rawMessage = typeof body === 'string'
      ? body
      : body && typeof body === 'object' && 'message' in body
        ? body.message
        : '서버 오류가 발생했습니다.';
    const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

    response.status(status).json({
      isSuccess: false,
      code: exception instanceof ApiException ? exception.code : `COMMON${status}`,
      message,
      result: null,
    });
  }
}
