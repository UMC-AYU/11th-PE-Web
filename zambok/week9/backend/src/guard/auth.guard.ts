import {
    CanActivate,
    ExecutionContext,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

import { ApiException } from "../exception/api.exception";

export interface AuthenticatedRequest extends Request {
    authenticatedMemberId: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const token = /^Bearer +([^\s,]+)$/i.exec(
            request.headers.authorization ?? "",
        )?.[1];

        if (!token) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                "AUTH401_2",
                "로그인이 필요한 요청입니다.",
            );
        }

        let payload: { sub?: unknown; exp?: unknown };

        try {
            payload = await this.jwtService.verifyAsync<typeof payload>(token);
        } catch (error) {
            if (error instanceof Error && error.name === "TokenExpiredError") {
                throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTH401_4",
                    "만료된 토큰입니다.",
                );
            }

            throw this.invalidToken();
        }

        if (
            typeof payload?.sub !== "number" ||
            !Number.isSafeInteger(payload.sub) ||
            payload.sub <= 0 ||
            typeof payload.exp !== "number" ||
            !Number.isFinite(payload.exp)
        ) {
            throw this.invalidToken();
        }

        request.authenticatedMemberId = payload.sub;
        return true;
    }

    private invalidToken(): ApiException {
        return new ApiException(
            HttpStatus.UNAUTHORIZED,
            "AUTH401_3",
            "유효하지 않은 토큰입니다.",
        );
    }
}
