import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';
import { RatingService } from '../service/rating.service';

@Controller('members')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':memberId/ratings')
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post(':memberId/ratings')
  @HttpCode(HttpStatus.CREATED)
  async createRating(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: CreateRatingDto,
  ) {
    const result = await this.ratingService.createRating(memberId, dto);
    return { isSuccess: true, code: 'COMMON201', message: '평점 등록에 성공했습니다.', result };
  }

  @Patch(':memberId/ratings/:ratingId')
  async updateRating(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const result = await this.ratingService.updateRating(memberId, ratingId, dto);
    return { isSuccess: true, code: 'COMMON200', message: '평점 수정에 성공했습니다.', result };
  }

  @Delete(':memberId/ratings/:ratingId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRating(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ): Promise<void> {
    await this.ratingService.deleteRating(memberId, ratingId);
  }
}
