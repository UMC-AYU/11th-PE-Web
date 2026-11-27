// src/controller/rating.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RatingService } from '../service/rating.service.js';
import {
  CreateRatingRequestDto,
  MemberRatingsResponseDto,
  RatingResponseDto,
  UpdateRatingRequestDto,
} from '../dto/rating.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { LoginMember } from '../auth/login-member.decorator.js';
import { ApiResponse } from '../common/api-response.js';
import { parseId } from '../common/parse-id.pipe.js';
import { ErrorStatus, SuccessStatus } from '../common/status.js';
import {
  ApiAuthFailure,
  ApiFailure,
  ApiSuccess,
  ApiValidationFailure,
} from '../common/swagger.js';

const ratingExample = {
  ratingId: 10,
  movieId: 550,
  score: 5,
  comment: '오랜 시간이 지나도 좋네요.',
  createdAt: '2026-11-25T10:00:00.000Z',
  updatedAt: '2026-11-25T10:00:00.000Z',
};

// 7주차: 평점 쓰기 API에서 경로의 memberId가 사라졌습니다.
// 누가 요청했는지는 JwtAuthGuard가 토큰에서 꺼내 @LoginMember()로 넘겨 줍니다.
@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // GET /members/1/ratings
  @ApiOperation({
    summary: '유저별 평점 조회',
    description:
      '[토큰 불필요] 특정 회원이 남긴 평점 목록을 최신순으로 조회합니다. 다른 회원의 평점도 볼 수 있는 공개 API입니다.',
  })
  @ApiParam({ name: 'memberId', description: '회원 ID', example: 2 })
  @ApiSuccess(SuccessStatus.RATINGS_FOUND, {
    memberId: 2,
    nickname: '영화광',
    ratingCount: 1,
    ratings: [ratingExample],
  })
  @ApiFailure('존재하지 않는 회원', ErrorStatus.MEMBER_NOT_FOUND)
  @Get('members/:memberId/ratings')
  async getMemberRatings(
    @Param('memberId', parseId('memberId')) memberId: number,
  ): Promise<ApiResponse<MemberRatingsResponseDto>> {
    const result = await this.ratingService.getMemberRatings(memberId);
    return ApiResponse.onSuccess(SuccessStatus.RATINGS_FOUND, result);
  }

  // POST /ratings → 201 Created
  @ApiOperation({
    summary: '평점 등록',
    description:
      '[🔒 토큰 필요] 영화에 평점을 남깁니다. 회원은 토큰에서 꺼내므로 memberId를 보내지 않습니다. 같은 영화에 두 번 등록하면 409입니다.',
  })
  @ApiBearerAuth()
  @ApiSuccess(SuccessStatus.RATING_CREATED, ratingExample)
  @ApiValidationFailure({
    field: 'score',
    message: '평점은 5점 이하여야 합니다.',
  })
  @ApiAuthFailure()
  @ApiFailure('존재하지 않는 회원', ErrorStatus.MEMBER_NOT_FOUND)
  @ApiFailure('이미 평점을 남긴 영화', ErrorStatus.RATING_ALREADY_EXISTS)
  @Post('ratings')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRating(
    @LoginMember() memberId: number,
    @Body() request: CreateRatingRequestDto,
  ): Promise<ApiResponse<RatingResponseDto>> {
    const result = await this.ratingService.createRating(memberId, request);
    return ApiResponse.onSuccess(SuccessStatus.RATING_CREATED, result);
  }

  // PATCH /ratings/10 → 200 OK
  @ApiOperation({
    summary: '평점 수정',
    description:
      '[🔒 토큰 필요] 내가 남긴 평점의 별점·한줄평 중 보낸 값만 바꿉니다. 다른 회원의 평점이면 403입니다.',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'ratingId', description: '평점 ID', example: 10 })
  @ApiSuccess(SuccessStatus.RATING_UPDATED, { ...ratingExample, score: 4 })
  @ApiFailure('수정할 내용이 없음', ErrorStatus.RATING_NOTHING_TO_UPDATE)
  @ApiAuthFailure()
  @ApiFailure('다른 회원의 평점', ErrorStatus.RATING_FORBIDDEN)
  @ApiFailure(
    '존재하지 않는 회원 또는 평점',
    ErrorStatus.MEMBER_NOT_FOUND,
    ErrorStatus.RATING_NOT_FOUND,
  )
  @Patch('ratings/:ratingId')
  @UseGuards(JwtAuthGuard)
  async updateRating(
    @LoginMember() memberId: number,
    @Param('ratingId', parseId('ratingId')) ratingId: number,
    @Body() request: UpdateRatingRequestDto,
  ): Promise<ApiResponse<RatingResponseDto>> {
    const result = await this.ratingService.updateRating(
      memberId,
      ratingId,
      request,
    );
    return ApiResponse.onSuccess(SuccessStatus.RATING_UPDATED, result);
  }

  // DELETE /ratings/10 → 204 No Content
  @ApiOperation({
    summary: '평점 삭제',
    description:
      '[🔒 토큰 필요] 내가 남긴 평점을 지웁니다. 성공하면 응답 본문 없이 204입니다. 다른 회원의 평점이면 403입니다.',
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'ratingId', description: '평점 ID', example: 10 })
  @ApiNoContentResponse({ description: '삭제 성공 (응답 본문 없음)' })
  @ApiAuthFailure()
  @ApiFailure('다른 회원의 평점', ErrorStatus.RATING_FORBIDDEN)
  @ApiFailure(
    '존재하지 않는 회원 또는 평점',
    ErrorStatus.MEMBER_NOT_FOUND,
    ErrorStatus.RATING_NOT_FOUND,
  )
  @Delete('ratings/:ratingId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRating(
    @LoginMember() memberId: number,
    @Param('ratingId', parseId('ratingId')) ratingId: number,
  ): Promise<void> {
    await this.ratingService.deleteRating(memberId, ratingId);
  }
}
