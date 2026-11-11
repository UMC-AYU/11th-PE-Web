import {
    BadRequestException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Rating } from "../entity/rating.entity";
import { Member } from "../entity/member.entity";
import { RatingResponseDto } from "../dto/rating-response.dto";
import { CreateRatingDto } from "../dto/create-rating.dto";
import { UpdateRatingDto } from "../dto/update-rating.dto";
import { ApiException } from "../exception/api.exception";
import { isDuplicateKey } from "../exception/mysql-error";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,

        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) {}

    async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
        this.validateId(memberId);

        const exists = await this.memberRepository.exists({
            where: { memberId },
        });

        if (!exists) {
            throw new NotFoundException("존재하지 않는 유저입니다.");
        }

        const ratings = await this.ratingRepository.find({
            where: { member: { memberId } },
            order: { ratingId: "DESC" },
        });

        return ratings.map(RatingResponseDto.from);
    }

    async create(memberId: number, dto: CreateRatingDto): Promise<RatingResponseDto> {
        try {
            return await this.ratingRepository.manager.transaction(async (manager) => {
                const members = manager.getRepository(Member);
                const ratings = manager.getRepository(Rating);

                // Serialize duplicate checks for concurrent writes by the same member.
                const member = await members.findOne({
                    where: { memberId },
                    select: { memberId: true },
                    lock: { mode: "pessimistic_write" },
                });

                if (!member) {
                    throw new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "존재하지 않는 유저입니다.",
                    );
                }

                const duplicate = await ratings.exists({
                    where: { member: { memberId }, movieId: dto.movieId },
                });

                if (duplicate) {
                    throw this.duplicateRating();
                }

                const rating = ratings.create({
                    member,
                    movieId: dto.movieId,
                    score: dto.score,
                    comment: dto.comment ?? null,
                });

                return RatingResponseDto.from(await ratings.save(rating));
            });
        } catch (error) {
            if (isDuplicateKey(error)) {
                throw this.duplicateRating();
            }
            throw error;
        }
    }

    async update(
        ratingId: number,
        memberId: number,
        dto: UpdateRatingDto,
    ): Promise<RatingResponseDto> {
        return this.ratingRepository.manager.transaction(async (manager) => {
            const ratings = manager.getRepository(Rating);
            const rating = await this.findOwnedRating(ratings, ratingId, memberId);

            rating.score = dto.score;
            rating.comment = dto.comment ?? null;

            return RatingResponseDto.from(await ratings.save(rating));
        });
    }

    async delete(ratingId: number, memberId: number): Promise<void> {
        await this.ratingRepository.manager.transaction(async (manager) => {
            const ratings = manager.getRepository(Rating);
            const rating = await this.findOwnedRating(ratings, ratingId, memberId);
            await ratings.remove(rating);
        });
    }

    private async findOwnedRating(
        ratings: Repository<Rating>,
        ratingId: number,
        memberId: number,
    ): Promise<Rating> {
        this.validateId(ratingId);

        const rating = await ratings.findOne({
            where: { ratingId },
            relations: { member: true },
            select: {
                ratingId: true,
                movieId: true,
                score: true,
                comment: true,
                createdAt: true,
                updatedAt: true,
                member: { memberId: true },
            },
            lock: { mode: "pessimistic_write" },
        });

        if (!rating) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                "RATING404_1",
                "존재하지 않는 평점입니다.",
            );
        }

        if (rating.member.memberId !== memberId) {
            throw new ApiException(
                HttpStatus.FORBIDDEN,
                "RATING403_1",
                "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
            );
        }

        return rating;
    }

    private duplicateRating(): ApiException {
        return new ApiException(
            HttpStatus.CONFLICT,
            "RATING409_1",
            "이미 이 영화에 평점을 등록했습니다.",
        );
    }

    private validateId(id: number): void {
        if (!Number.isSafeInteger(id) || id <= 0) {
            throw new BadRequestException("올바르지 않은 ID입니다.");
        }
    }
}
