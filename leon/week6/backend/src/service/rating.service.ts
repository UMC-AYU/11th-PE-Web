import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entity/rating.entity';
import { Member } from '../entity/member.entity';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { RatingResponseDto } from '../dto/rating-response.dto';
import { UpdateRatingDto } from '../dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) throw new NotFoundException('존재하지 않는 유저입니다.');

    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { ratingId: 'DESC' },
    });
    return ratings.map(RatingResponseDto.from);
  }

  async createRating(memberId: number, dto: CreateRatingDto): Promise<RatingResponseDto> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) throw new NotFoundException('존재하지 않는 회원입니다.');

    const exists = await this.ratingRepository.exists({ where: { member: { memberId }, movieId: dto.movieId } });
    if (exists) throw new ConflictException('이미 평점을 등록한 영화입니다.');

    try {
      const saved = await this.ratingRepository.save(this.ratingRepository.create({
        member,
        movieId: dto.movieId,
        score: dto.score,
        review: dto.review,
      }));
      return RatingResponseDto.from(saved);
    } catch (error) {
      if (error instanceof Error && /UNIQUE constraint failed|unique constraint/i.test(error.message)) {
        throw new ConflictException('이미 평점을 등록한 영화입니다.');
      }
      throw error;
    }
  }

  async updateRating(memberId: number, ratingId: number, dto: UpdateRatingDto): Promise<RatingResponseDto> {
    if (dto.score === undefined && dto.review === undefined) {
      throw new BadRequestException('수정할 별점 또는 리뷰를 입력해주세요.');
    }
    const rating = await this.findOwnedRating(memberId, ratingId);
    if (dto.score !== undefined) rating.score = dto.score;
    if (dto.review !== undefined) rating.review = dto.review;
    return RatingResponseDto.from(await this.ratingRepository.save(rating));
  }

  async deleteRating(memberId: number, ratingId: number): Promise<void> {
    const rating = await this.findOwnedRating(memberId, ratingId);
    await this.ratingRepository.remove(rating);
  }

  private async findOwnedRating(memberId: number, ratingId: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });
    if (!rating) throw new NotFoundException('존재하지 않는 평점입니다.');
    if (rating.member.memberId !== memberId) {
      throw new ForbiddenException('다른 회원의 평점은 수정하거나 삭제할 수 없습니다.');
    }
    return rating;
  }
}
