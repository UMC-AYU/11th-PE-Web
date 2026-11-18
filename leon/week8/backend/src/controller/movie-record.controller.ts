import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateMovieRecordDto } from '../dto/create-movie-record.dto';
import { AuthGuard } from '../guard/auth.guard';
import { MovieRecordService } from '../service/movie-record.service';

@Controller('movie-records')
@UseGuards(AuthGuard)
@ApiTags('영화 기록 (인증 필요)')
@ApiBearerAuth()
export class MovieRecordController {
  constructor(private readonly movieRecordService: MovieRecordService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '평점과 선택적 즐겨찾기 저장' })
  @ApiBody({ type: CreateMovieRecordDto })
  @ApiResponse({ status: 201, description: '저장 성공: COMMON201', example: { isSuccess: true, code: 'COMMON201', message: '영화 기록을 저장했습니다.', result: { rating: { ratingId: 1, movieId: 238, score: 5, comment: '다시 보고 싶은 영화입니다.', createdAt: '2026-11-18T00:00:00.000Z' }, favorite: { favoriteId: 1, movieId: 238, createdAt: '2026-11-18T00:00:00.000Z' } } } })
  @ApiResponse({ status: 400, description: '유효하지 않은 요청: COMMON400', example: { isSuccess: false, code: 'COMMON400', message: '별점은 5점 이하여야 합니다.', result: null } })
  @ApiResponse({ status: 401, description: 'Bearer 토큰 없음: AUTH401_2', example: { isSuccess: false, code: 'AUTH401_2', message: '로그인이 필요한 요청입니다.', result: null } })
  @ApiResponse({ status: 409, description: '평점 중복: RATING409_1 또는 즐겨찾기 중복: FAVORITE409_1', examples: { duplicateRating: { summary: '평점 중복', value: { isSuccess: false, code: 'RATING409_1', message: '이미 이 영화에 평점을 남기셨습니다.', result: null } }, duplicateFavorite: { summary: '즐겨찾기 중복', value: { isSuccess: false, code: 'FAVORITE409_1', message: '이미 이 영화를 즐겨찾기하셨습니다.', result: null } } } })
  async create(@Req() request: Request, @Body() dto: CreateMovieRecordDto) {
    const result = await this.movieRecordService.create(request.memberId!, dto);
    return { isSuccess: true, code: 'COMMON201', message: '영화 기록을 저장했습니다.', result };
  }
}
