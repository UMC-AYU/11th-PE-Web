import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiAuthErrors, ApiEnvelopeResponse, ApiFailure } from "../swagger/responses";
import { MovieRecordResponseDto } from "../dto/movie-record-response.dto";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto";
import { AuthGuard, type AuthenticatedRequest } from "../guard/auth.guard";
import { MovieRecordService } from "../service/movie-record.service";

@ApiTags("영화 기록")
@ApiBearerAuth("access-token")
@ApiAuthErrors()
@Controller("movie-records")
@UseGuards(AuthGuard)
export class MovieRecordController {
    constructor(private readonly movieRecordService: MovieRecordService) {}

    @Post()
    @ApiOperation({ summary: "평점과 선택적 즐겨찾기 일괄 등록", description: "하나의 트랜잭션으로 처리합니다. 어느 한 등록이 실패하면 전체를 취소합니다." })
    @ApiEnvelopeResponse(201, "영화 기록을 저장했습니다.", MovieRecordResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { MEMBER404_1: "존재하지 않는 유저입니다." })
    @ApiFailure(409, { RATING409_1: "이미 이 영화에 평점을 등록했습니다.", FAVORITE409_1: "이미 이 영화를 즐겨찾기하셨습니다." })

    @HttpCode(HttpStatus.CREATED)
    async create(@Req() request: AuthenticatedRequest, @Body() dto: CreateMovieRecordDto) {
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "영화 기록을 저장했습니다.",
            result: await this.movieRecordService.create(request.authenticatedMemberId, dto),
        };
    }
}
