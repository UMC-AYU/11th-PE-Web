import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { AuthGuard } from '../guard/auth.guard';
import { FavoriteService } from '../service/favorite.service';

@Controller('favorites')
@UseGuards(AuthGuard)
@ApiTags('즐겨찾기 (인증 필요)')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Bearer 토큰 없음: AUTH401_2', example: { isSuccess: false, code: 'AUTH401_2', message: '로그인이 필요한 요청입니다.', result: null } })
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '즐겨찾기 등록' })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({ status: 201, description: '등록 성공: COMMON201', example: { isSuccess: true, code: 'COMMON201', message: '즐겨찾기를 등록했습니다.', result: { favoriteId: 1, movieId: 550, createdAt: '2026-11-18T00:00:00.000Z' } } })
  @ApiResponse({ status: 400, description: '유효하지 않은 movieId: COMMON400', example: { isSuccess: false, code: 'COMMON400', message: '영화 ID는 양수여야 합니다.', result: null } })
  @ApiResponse({ status: 409, description: '중복 즐겨찾기: FAVORITE409_1', example: { isSuccess: false, code: 'FAVORITE409_1', message: '이미 이 영화를 즐겨찾기하셨습니다.', result: null } })
  async create(@Req() request: Request, @Body() dto: CreateFavoriteDto) {
    const result = await this.favoriteService.create(request.memberId!, dto);
    return { isSuccess: true, code: 'COMMON201', message: '즐겨찾기를 등록했습니다.', result };
  }

  @Get()
  @ApiOperation({ summary: '내 즐겨찾기 목록 조회' })
  @ApiResponse({ status: 200, description: '조회 성공: COMMON200', example: { isSuccess: true, code: 'COMMON200', message: '내 즐겨찾기 목록을 조회했습니다.', result: [{ favoriteId: 1, movieId: 550, createdAt: '2026-11-18T00:00:00.000Z' }] } })
  async getMyFavorites(@Req() request: Request) {
    const result = await this.favoriteService.getMyFavorites(request.memberId!);
    return { isSuccess: true, code: 'COMMON200', message: '내 즐겨찾기 목록을 조회했습니다.', result };
  }

  @Get(':movieId')
  @ApiOperation({ summary: '영화 즐겨찾기 여부 조회' })
  @ApiParam({ name: 'movieId', type: Number, example: 550, description: 'TMDB 영화 ID' })
  @ApiResponse({ status: 200, description: '조회 성공: COMMON200', example: { isSuccess: true, code: 'COMMON200', message: '즐겨찾기 여부를 조회했습니다.', result: { isFavorite: true } } })
  @ApiResponse({ status: 400, description: '유효하지 않은 movieId: COMMON400', example: { isSuccess: false, code: 'COMMON400', message: 'Validation failed (numeric string is expected)', result: null } })
  async getStatus(@Req() request: Request, @Param('movieId', ParseIntPipe) movieId: number) {
    const result = await this.favoriteService.getStatus(request.memberId!, movieId);
    return { isSuccess: true, code: 'COMMON200', message: '즐겨찾기 여부를 조회했습니다.', result };
  }

  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '즐겨찾기 해제' })
  @ApiParam({ name: 'movieId', type: Number, example: 550, description: 'TMDB 영화 ID' })
  @ApiResponse({ status: 200, description: '해제 성공: COMMON200', example: { isSuccess: true, code: 'COMMON200', message: '즐겨찾기를 해제했습니다.', result: null } })
  @ApiResponse({ status: 400, description: '유효하지 않은 movieId: COMMON400', example: { isSuccess: false, code: 'COMMON400', message: 'Validation failed (numeric string is expected)', result: null } })
  @ApiResponse({ status: 404, description: '즐겨찾기 없음: FAVORITE404_1', example: { isSuccess: false, code: 'FAVORITE404_1', message: '즐겨찾기한 영화를 찾을 수 없습니다.', result: null } })
  async delete(@Req() request: Request, @Param('movieId', ParseIntPipe) movieId: number) {
    await this.favoriteService.delete(request.memberId!, movieId);
    return { isSuccess: true, code: 'COMMON200', message: '즐겨찾기를 해제했습니다.', result: null };
  }
}
