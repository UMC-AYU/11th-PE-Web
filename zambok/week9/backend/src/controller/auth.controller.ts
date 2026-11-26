import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiEnvelopeResponse, ApiFailure } from "../swagger/responses";
import { LoginResponseDto } from "../dto/login-response.dto";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginRequestDto } from "../dto/login-request.dto";
import { AuthService } from "../service/auth.service";

@ApiTags("인증")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    @ApiOperation({ summary: "로그인 및 JWT 발급" })
    @ApiEnvelopeResponse(200, "요청 처리에 성공했습니다.", LoginResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(401, { AUTH401_1: "이메일 또는 비밀번호가 올바르지 않습니다." })

    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginRequestDto) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "요청 처리에 성공했습니다.",
            result: await this.authService.login(dto),
        };
    }
}
