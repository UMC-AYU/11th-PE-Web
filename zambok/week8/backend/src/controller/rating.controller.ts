import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";

import { CreateRatingDto } from "../dto/create-rating.dto";
import { UpdateRatingDto } from "../dto/update-rating.dto";
import { AuthGuard, type AuthenticatedRequest } from "../guard/auth.guard";
import { RatingService } from "../service/rating.service";

@Controller("ratings")
@UseGuards(AuthGuard)
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Req() request: AuthenticatedRequest,
        @Body() dto: CreateRatingDto,
    ) {
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "평점 등록에 성공했습니다.",
            result: await this.ratingService.create(request.authenticatedMemberId, dto),
        };
    }

    @Patch(":ratingId")
    async update(
        @Req() request: AuthenticatedRequest,
        @Param("ratingId", ParseIntPipe) ratingId: number,
        @Body() dto: UpdateRatingDto,
    ) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "평점 수정에 성공했습니다.",
            result: await this.ratingService.update(ratingId, request.authenticatedMemberId, dto),
        };
    }

    @Delete(":ratingId")
    @HttpCode(HttpStatus.OK)
    async delete(
        @Req() request: AuthenticatedRequest,
        @Param("ratingId", ParseIntPipe) ratingId: number,
    ) {
        await this.ratingService.delete(ratingId, request.authenticatedMemberId);

        return {
            isSuccess: true,
            code: "COMMON200",
            message: "평점 삭제에 성공했습니다.",
            result: null,
        };
    }
}
