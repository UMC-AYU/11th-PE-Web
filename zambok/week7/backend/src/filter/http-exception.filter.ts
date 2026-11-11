import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import type { Response } from "express";
import { ApiException } from "../exception/api.exception";
import { isDuplicateKey } from "../exception/mysql-error";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host
            .switchToHttp()
            .getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "서버 내부 오류가 발생했습니다.";

        if (exception instanceof ApiException) {
            response.status(exception.getStatus()).json({
                isSuccess: false,
                code: exception.code,
                message: exception.message,
                result: null,
            });
            return;
        }

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const error = exception.getResponse();

            if (status >= 500) {
                message = "서버 내부 오류가 발생했습니다.";
            } else if (typeof error === "string") {
                message = error;
            } else if (
                typeof error === "object" &&
                error !== null &&
                "message" in error
            ) {
                const value = error.message;

                if (Array.isArray(value)) {
                    message = value.join(", ");
                } else if (typeof value === "string") {
                    message = value;
                }
            }
        }

        if (isDuplicateKey(exception)) {
            status = HttpStatus.CONFLICT;
            message = "이미 등록된 데이터입니다.";
        }

        let code = `COMMON${status}`;

        if (status === 409) {
            if (message.includes("이메일")) {
                code = "MEMBER4091";
            } else if (message.includes("평점")) {
                code = "RATING4091";
            }
        }

        response.status(status).json({
            isSuccess: false,
            code,
            message,
            result: null,
        });
    }
}
