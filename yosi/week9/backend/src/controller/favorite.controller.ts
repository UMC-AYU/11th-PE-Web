// src/controller/favorite.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFavoriteDto } from '../dto/create-favorite.dto.js';
import { FavoriteResponseDto } from '../dto/favorite-response.dto.js';
import { FavoriteStatusResponseDto } from '../dto/favorite-status-response.dto.js';
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
import { FavoriteService } from '../service/favorite.service.js';

// 즐겨찾기 API는 모두 "내 즐겨찾기"라 토큰이 필요합니다.
// @ApiBearerAuth()를 컨트롤러에 붙이면 모든 API에 🔒 자물쇠가 붙고, 공통 401 응답도 함께 적습니다.
@ApiTags('즐겨찾기')
@ApiBearerAuth()
@ApiAuthFailure()
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  // POST /favorites → 201 Created
  @ApiOperation({
    summary: '즐겨찾기 등록',
    description:
      '[🔒 토큰 필요] 영화 상세에서 즐겨찾기 버튼을 누르면 호출합니다. 회원은 토큰에서 꺼내므로 요청에 memberId를 보내지 않습니다. 같은 영화를 두 번 등록하면 409를 돌려줍니다.',
  })
  @ApiSuccess(SuccessStatus.FAVORITE_ADDED, {
    favoriteId: 1,
    movieId: 550,
    createdAt: '2026-11-25T10:00:00.000Z',
  })
  @ApiValidationFailure({
    field: 'movieId',
    message: '영화 ID는 양수여야 합니다.',
  })
  @ApiFailure('이미 즐겨찾기한 영화', ErrorStatus.FAVORITE_ALREADY_EXISTS)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @LoginMember() memberId: number,
    @Body() dto: CreateFavoriteDto,
  ): Promise<ApiResponse<FavoriteResponseDto>> {
    const result = await this.favoriteService.create(memberId, dto);
    return ApiResponse.onSuccess(SuccessStatus.FAVORITE_ADDED, result);
  }

  // GET /favorites → 200 OK (내 즐겨찾기 목록)
  @ApiOperation({
    summary: '내 즐겨찾기 조회',
    description:
      '[🔒 토큰 필요] 마이페이지에서 호출합니다. 내 즐겨찾기만 최근 등록 순으로 돌려줍니다. 없으면 빈 배열([])입니다.',
  })
  @ApiSuccess(SuccessStatus.FAVORITES_FOUND, [
    { favoriteId: 2, movieId: 155, createdAt: '2026-11-25T10:05:00.000Z' },
    { favoriteId: 1, movieId: 550, createdAt: '2026-11-25T10:00:00.000Z' },
  ])
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMyFavorites(
    @LoginMember() memberId: number,
  ): Promise<ApiResponse<FavoriteResponseDto[]>> {
    const result = await this.favoriteService.getMyFavorites(memberId);
    return ApiResponse.onSuccess(SuccessStatus.FAVORITES_FOUND, result);
  }

  // GET /favorites/155 → 200 OK (이 영화를 즐겨찾기했는지)
  @ApiOperation({
    summary: '특정 영화 즐겨찾기 여부 조회',
    description:
      '[🔒 토큰 필요] 영화 상세에 들어올 때 호출해서 버튼을 "즐겨찾기" 또는 "해제"로 보여 줍니다. 즐겨찾기하지 않았어도 오류가 아니라 isFavorite: false입니다.',
  })
  @ApiParam({ name: 'movieId', description: 'TMDB 영화 ID', example: 550 })
  @ApiSuccess(SuccessStatus.FAVORITE_STATUS_FOUND, { isFavorite: true })
  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @LoginMember() memberId: number,
    @Param('movieId', parseId('movieId')) movieId: number,
  ): Promise<ApiResponse<FavoriteStatusResponseDto>> {
    const result = await this.favoriteService.getStatus(memberId, movieId);
    return ApiResponse.onSuccess(SuccessStatus.FAVORITE_STATUS_FOUND, result);
  }

  // DELETE /favorites/155 → 200 OK, result: null
  @ApiOperation({
    summary: '즐겨찾기 해제',
    description:
      '[🔒 토큰 필요] 영화 상세에서 해제 버튼을 누르면 호출합니다. 즐겨찾기하지 않은 영화면 404를 돌려줍니다.',
  })
  @ApiParam({ name: 'movieId', description: 'TMDB 영화 ID', example: 550 })
  @ApiSuccess(SuccessStatus.FAVORITE_REMOVED, null)
  @ApiFailure('즐겨찾기하지 않은 영화', ErrorStatus.FAVORITE_NOT_FOUND)
  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @LoginMember() memberId: number,
    @Param('movieId', parseId('movieId')) movieId: number,
  ): Promise<ApiResponse<null>> {
    await this.favoriteService.delete(memberId, movieId);
    return ApiResponse.onSuccess(SuccessStatus.FAVORITE_REMOVED, null);
  }
}
