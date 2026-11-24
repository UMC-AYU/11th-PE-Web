import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiAuthErrors, ApiEnvelopeResponse, ApiFailure } from "../swagger/responses";
import { RatingResponseDto } from "../dto/rating-response.dto";
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

@ApiTags("평점")
@ApiBearerAuth("access-token")
@ApiAuthErrors()
@Controller("ratings")
@UseGuards(AuthGuard)
export class RatingController {
    constructor(private readonly ratingService: RatingService) {}

    @Post()
    @ApiOperation({ summary: "영화 평점 등록" })
    @ApiEnvelopeResponse(201, "평점 등록에 성공했습니다.", RatingResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { MEMBER404_1: "존재하지 않는 유저입니다." })
    @ApiFailure(409, { RATING409_1: "이미 이 영화에 평점을 등록했습니다." })

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
    @ApiOperation({ summary: "내 평점 수정" })
    @ApiParam({ name: "ratingId", type: Number, example: 1 })
    @ApiEnvelopeResponse(200, "평점 수정에 성공했습니다.", RatingResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { RATING404_1: "존재하지 않는 평점입니다." })
    @ApiFailure(403, { RATING403_1: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다." })

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
    @ApiOperation({ summary: "내 평점 삭제" })
    @ApiParam({ name: "ratingId", type: Number, example: 1 })
    @ApiEnvelopeResponse(200, "평점 삭제에 성공했습니다.")
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { RATING404_1: "존재하지 않는 평점입니다." })
    @ApiFailure(403, { RATING403_1: "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다." })

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
