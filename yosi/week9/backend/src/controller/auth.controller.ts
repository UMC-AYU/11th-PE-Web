// src/controller/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service.js';
import { LoginRequestDto, LoginResponseDto } from '../dto/login-request.dto.js';
import { ApiResponse } from '../common/api-response.js';
import { ErrorStatus, SuccessStatus } from '../common/status.js';
import {
  ApiFailure,
  ApiSuccess,
  ApiValidationFailure,
} from '../common/swagger.js';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/login
  @ApiOperation({
    summary: '이메일 로그인',
    description:
      '[토큰 불필요] 이메일과 비밀번호로 로그인하고 Access Token을 발급받습니다. 발급받은 토큰은 이후 요청의 `Authorization: Bearer {token}` 헤더에 넣습니다.',
  })
  @ApiSuccess(SuccessStatus.LOGIN_SUCCEEDED, {
    nickname: '영화광',
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @ApiValidationFailure({
    field: 'email',
    message: '이메일 형식이 올바르지 않습니다.',
  })
  // 없는 이메일과 틀린 비밀번호를 구분하지 않아, 가입 여부가 드러나지 않습니다.
  @ApiFailure(
    '이메일 또는 비밀번호가 틀림 (가입 여부를 숨기려고 한 가지로 응답)',
    ErrorStatus.LOGIN_FAILED,
  )
  @Post('login')
  @HttpCode(HttpStatus.OK) // NestJS의 @Post 기본 응답은 201이라 200으로 바꿔 줍니다.
  async login(
    @Body() dto: LoginRequestDto,
  ): Promise<ApiResponse<LoginResponseDto>> {
    const result = await this.authService.login(dto);
    return ApiResponse.onSuccess(SuccessStatus.LOGIN_SUCCEEDED, result);
  }
}
