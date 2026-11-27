// src/service/rating.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity.js';
import { Rating } from '../entity/rating.entity.js';
import {
  CreateRatingRequestDto,
  MemberRatingsResponseDto,
  RatingResponseDto,
  UpdateRatingRequestDto,
} from '../dto/rating.dto.js';
import { ErrorStatus } from '../common/status.js';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  async getMemberRatings(memberId: number): Promise<MemberRatingsResponseDto> {
    const member = await this.findMemberOrThrow(memberId);

    // 해당 회원의 평점을 최신순으로 조회합니다.
    const ratings = await this.ratingRepository.find({
      where: { member: { memberId } },
      order: { createdAt: 'DESC', ratingId: 'DESC' },
    });
    return MemberRatingsResponseDto.from(member, ratings);
  }

  async createRating(
    memberId: number,
    request: CreateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    // 1. 존재하지 않는 회원이면 저장하지 않고 404를 돌려줍니다.
    const member = await this.findMemberOrThrow(memberId);

    // 2. 한 회원은 영화 하나에 평점을 하나만 남길 수 있습니다. (uk_rating_member_movie)
    const exists = await this.ratingRepository.existsBy({
      member: { memberId },
      movieId: request.movieId,
    });
    if (exists) {
      throw new ConflictException(ErrorStatus.RATING_ALREADY_EXISTS);
    }

    const rating = await this.ratingRepository.save(
      this.ratingRepository.create({
        member,
        movieId: request.movieId,
        score: request.score,
        comment: request.comment ?? null,
      }),
    );
    return RatingResponseDto.from(rating);
  }

  async updateRating(
    memberId: number,
    ratingId: number,
    request: UpdateRatingRequestDto,
  ): Promise<RatingResponseDto> {
    // 바꿀 값이 하나도 없으면 DB까지 가지 않고 400을 돌려줍니다.
    if (request.score === undefined && request.comment === undefined) {
      throw new BadRequestException(ErrorStatus.RATING_NOTHING_TO_UPDATE);
    }

    const rating = await this.findOwnRatingOrThrow(memberId, ratingId);

    // 보낸 값만 바꿉니다. comment에 null을 보내면 한줄평을 지웁니다.
    if (request.score !== undefined) rating.score = request.score;
    if (request.comment !== undefined) rating.comment = request.comment;

    const updated = await this.ratingRepository.save(rating);
    return RatingResponseDto.from(updated);
  }

  async deleteRating(memberId: number, ratingId: number): Promise<void> {
    const rating = await this.findOwnRatingOrThrow(memberId, ratingId);
    await this.ratingRepository.remove(rating);
  }

  private async findMemberOrThrow(memberId: number): Promise<Member> {
    const member = await this.memberRepository.findOneBy({ memberId });
    if (!member) {
      throw new NotFoundException(ErrorStatus.MEMBER_NOT_FOUND);
    }
    return member;
  }

  // 수정·삭제 전에 평점이 있는지, 요청한 회원이 평점의 주인인지 확인합니다.
  private async findOwnRatingOrThrow(
    memberId: number,
    ratingId: number,
  ): Promise<Rating> {
    await this.findMemberOrThrow(memberId);

    // 1. 평점이 없으면 404
    //    누가 남긴 평점인지 비교해야 해서 작성자(member)도 함께 불러옵니다.
    const rating = await this.ratingRepository.findOne({
      where: { ratingId },
      relations: { member: true },
    });
    if (!rating) {
      throw new NotFoundException(ErrorStatus.RATING_NOT_FOUND);
    }

    // 2. 요청한 memberId와 평점 작성자가 다르면 403
    //    BIGINT 값은 문자열로 올 수 있어서 숫자로 바꿔 비교합니다.
    if (Number(rating.member.memberId) !== memberId) {
      throw new ForbiddenException(ErrorStatus.RATING_FORBIDDEN);
    }
    return rating;
  }
}
