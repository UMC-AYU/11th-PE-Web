import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Rating } from "../entity/rating.entity";
import { Member } from "../entity/member.entity";
import { RatingResponseDto } from "../dto/rating-response.dto";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,

        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) { }

    async getRatingsByMember(memberId: number): Promise<RatingResponseDto[]> {
        if (!Number.isSafeInteger(memberId) || memberId <= 0) {
            throw new BadRequestException("올바르지 않은 회원 ID입니다.");
        }

        const exists = await this.memberRepository.exists({
            where: { memberId },
        });

        if (!exists) {
            throw new NotFoundException("존재하지 않는 유저입니다.");
        }

        const ratings = await this.ratingRepository.find({
            where: {
                member: { memberId },
            },
            order: {
                ratingId: "DESC",
            },
        });

        return ratings.map(RatingResponseDto.from);
    }
}