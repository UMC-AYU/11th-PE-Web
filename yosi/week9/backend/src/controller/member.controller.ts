// src/controller/member.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from '../service/member.service.js';
import {
  EmailAvailabilityResponseDto,
  EmailParamDto,
  NicknameAvailabilityResponseDto,
  NicknameParamDto,
} from '../dto/member.dto.js';
import {
  CreateMemberDto,
  MemberResponseDto,
} from '../dto/create-member.dto.js';
import {
  MyProfileResponseDto,
  UpdateMyProfileDto,
} from '../dto/my-profile.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { LoginMember } from '../auth/login-member.decorator.js';
import { ApiResponse } from '../common/api-response.js';
import { ErrorStatus, SuccessStatus } from '../common/status.js';
import {
  ApiAuthFailure,
  ApiFailure,
  ApiSuccess,
  ApiValidationFailure,
} from '../common/swagger.js';

@ApiTags('회원')
@Controller('members') // 이 컨트롤러로 들어오는 기본 주소: /members
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // POST /members → 201 Created
  // 요청 본문은 ValidationPipe가 CreateMemberDto 기준으로 검증합니다.
  @ApiOperation({
    summary: '회원가입',
    description:
      '[토큰 불필요] 이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 비밀번호는 bcrypt로 해시해 저장하고 응답에는 포함하지 않습니다.',
  })
  @ApiSuccess(SuccessStatus.MEMBER_SIGNED_UP, {
    memberId: 8,
    email: 'umc9@example.com',
    nickname: '무비팬',
  })
  @ApiValidationFailure(
    { field: 'email', message: '올바른 이메일 형식이 아닙니다.' },
    {
      field: 'password',
      message:
        '비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.',
    },
  )
  @ApiFailure(
    '이미 사용 중인 이메일 또는 닉네임',
    ErrorStatus.EMAIL_ALREADY_EXISTS,
    ErrorStatus.NICKNAME_ALREADY_EXISTS,
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() request: CreateMemberDto,
  ): Promise<ApiResponse<MemberResponseDto>> {
    const result = await this.memberService.signUp(request);
    return ApiResponse.onSuccess(SuccessStatus.MEMBER_SIGNED_UP, result);
  }

  // GET /members/me (Authorization: Bearer {token})
  // 경로에 memberId가 없습니다. 누구인지는 토큰이 알려 줍니다.
  @ApiOperation({
    summary: '내 정보 조회',
    description:
      '[🔒 토큰 필요] 로그인한 회원의 이메일, 닉네임, 가입일을 조회합니다.',
  })
  @ApiBearerAuth()
  @ApiSuccess(SuccessStatus.MY_PROFILE_FOUND, {
    email: 'movie@umc.com',
    nickname: '영화광',
    createdAt: '2026-10-28T14:10:35.000Z',
  })
  @ApiAuthFailure()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(
    @LoginMember() memberId: number,
  ): Promise<ApiResponse<MyProfileResponseDto>> {
    const result = await this.memberService.getMyProfile(memberId);
    return ApiResponse.onSuccess(SuccessStatus.MY_PROFILE_FOUND, result);
  }

  // PATCH /members/me (Authorization: Bearer {token})
  @ApiOperation({
    summary: '내 정보 수정',
    description:
      '[🔒 토큰 필요] 로그인한 회원의 닉네임을 바꿉니다. 다른 회원이 쓰는 닉네임이면 409입니다.',
  })
  @ApiBearerAuth()
  @ApiSuccess(SuccessStatus.MY_PROFILE_UPDATED, {
    email: 'movie@umc.com',
    nickname: '영화광',
    createdAt: '2026-10-28T14:10:35.000Z',
  })
  @ApiAuthFailure()
  @ApiFailure('이미 사용 중인 닉네임', ErrorStatus.NICKNAME_ALREADY_EXISTS)
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @LoginMember() memberId: number,
    @Body() request: UpdateMyProfileDto,
  ): Promise<ApiResponse<MyProfileResponseDto>> {
    const result = await this.memberService.updateMyProfile(memberId, request);
    return ApiResponse.onSuccess(SuccessStatus.MY_PROFILE_UPDATED, result);
  }

  // GET /members/nickname/yosi
  @ApiOperation({
    summary: '닉네임 중복 확인',
    description: '[토큰 불필요] available이 true면 사용 가능합니다.',
  })
  @Get('nickname/:nickname')
  async checkNickname(
    @Param() params: NicknameParamDto,
  ): Promise<ApiResponse<NicknameAvailabilityResponseDto>> {
    const result = await this.memberService.checkNickname(params.nickname);
    return ApiResponse.onSuccess(SuccessStatus.NICKNAME_CHECKED, result);
  }

  // GET /members/email/yosi@umc.com
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '[토큰 불필요] available이 true면 사용 가능합니다.',
  })
  @Get('email/:email')
  async checkEmail(
    @Param() params: EmailParamDto,
  ): Promise<ApiResponse<EmailAvailabilityResponseDto>> {
    const result = await this.memberService.checkEmail(params.email);
    return ApiResponse.onSuccess(SuccessStatus.EMAIL_CHECKED, result);
  }
}
