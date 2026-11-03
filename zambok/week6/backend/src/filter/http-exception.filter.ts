import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const response = host
            .switchToHttp()
            .getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = "서버 내부 오류가 발생했습니다.";

        if (exception instanceof HttpException) {
            status = exception.getStatus();

            const error = exception.getResponse();

            if (typeof error === "string") {
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

        // MySQL UNIQUE 제약 위반 처리
        if (
            typeof exception === "object" &&
            exception !== null &&
            "driverError" in exception
        ) {
            const driverError = exception.driverError as {
                code?: string;
                sqlMessage?: string;
            };

            if (driverError?.code === "ER_DUP_ENTRY") {
                status = HttpStatus.CONFLICT;
                message = "이미 등록된 데이터입니다.";
            }
        }

        let code = `COMMON${status}`;

        if (status === 409) {
            if (message.includes("이메일")) {
                code = "MEMBER4091";
            } else if (message.includes("닉네임")) {
                code = "MEMBER4092";
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