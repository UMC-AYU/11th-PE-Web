import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@ApiTags('공개 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인 및 토큰 발급 (인증 불필요)' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, description: '로그인 성공', example: { isSuccess: true, code: 'COMMON200', message: '로그인에 성공했습니다.', result: { nickname: '영화팬', accessToken: 'eyJ...' } } })
  @ApiResponse({ status: 401, description: '인증 실패: AUTH401_1', example: { isSuccess: false, code: 'AUTH401_1', message: '이메일 또는 비밀번호가 올바르지 않습니다.', result: null } })
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.authService.login(dto);
    return { isSuccess: true, code: 'COMMON200', message: '로그인에 성공했습니다.', result };
  }
}
