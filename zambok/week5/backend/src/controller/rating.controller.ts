import { Controller, Get, Param } from "@nestjs/common";
import { RatingService } from "../service/rating.service";

@Controller("members")
export class RatingController {
    constructor(private readonly ratingService: RatingService) { }

    @Get(":memberId/ratings")
    getMemberRatings(@Param("memberId") memberId: string) {
        return this.ratingService.getRatingsByMember(Number(memberId));
    }
}