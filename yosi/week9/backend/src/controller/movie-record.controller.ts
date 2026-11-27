// src/controller/movie-record.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MovieRecordService } from '../service/movie-record.service.js';
import {
  CreateMovieRecordRequestDto,
  MovieRecordResponseDto,
} from '../dto/movie-record.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { LoginMember } from '../auth/login-member.decorator.js';
import { ApiResponse } from '../common/api-response.js';
import { ErrorStatus, SuccessStatus } from '../common/status.js';
import { ApiAuthFailure, ApiFailure } from '../common/swagger.js';

@ApiTags('영화 기록')
@ApiBearerAuth()
@ApiAuthFailure()
@Controller('movie-records')
@UseGuards(JwtAuthGuard)
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  // POST /movie-records → 201 Created
  // Body: movieId, score, comment, addToFavorites (memberId는 토큰에서 꺼냅니다.)
  @ApiOperation({
    summary: '평점과 즐겨찾기 함께 저장',
    description:
      '평점 저장과 즐겨찾기 추가를 하나의 트랜잭션으로 처리합니다. 하나라도 실패하면 둘 다 저장되지 않습니다.',
  })
  @ApiFailure(
    '이미 평점을 남긴 영화 (즐겨찾기도 저장되지 않음)',
    ErrorStatus.RATING_ALREADY_EXISTS,
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMovieRecord(
    @LoginMember() memberId: number,
    @Body() request: CreateMovieRecordRequestDto,
  ): Promise<ApiResponse<MovieRecordResponseDto>> {
    const result = await this.movieRecordService.createMovieRecord(
      memberId,
      request,
    );
    return ApiResponse.onSuccess(SuccessStatus.MOVIE_RECORD_CREATED, result);
  }
}
