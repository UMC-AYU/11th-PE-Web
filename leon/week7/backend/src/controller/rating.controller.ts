import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { RatingService } from '../service/rating.service';
import { AuthGuard } from '../guard/auth.guard';

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('members/:memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRating(
    @Req() request: Request,
    @Body() dto: CreateRatingDto,
  ) {
    const result = await this.ratingService.createRating(request.memberId!, dto);
    return { isSuccess: true, code: 'COMMON201', message: '평점을 등록했습니다.', result };
  }

  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  async updateRating(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const result = await this.ratingService.updateRating(request.memberId!, ratingId, dto);
    return { isSuccess: true, code: 'COMMON200', message: '평점을 수정했습니다.', result };
  }

  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteRating(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    await this.ratingService.deleteRating(request.memberId!, ratingId);
    return { isSuccess: true, code: 'COMMON200', message: '평점을 삭제했습니다.', result: null };
  }
}
