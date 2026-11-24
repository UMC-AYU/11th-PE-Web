import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ApiAuthErrors, ApiEnvelopeResponse, ApiFailure } from "../swagger/responses";
import { FavoriteResponseDto } from "../dto/favorite-response.dto";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { CreateFavoriteDto } from "../dto/create-favorite.dto";
import { AuthGuard, type AuthenticatedRequest } from "../guard/auth.guard";
import { FavoriteService } from "../service/favorite.service";

@ApiTags("즐겨찾기")
@ApiBearerAuth("access-token")
@ApiAuthErrors()
@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post()
    @ApiOperation({ summary: "영화 즐겨찾기 등록" })
    @ApiEnvelopeResponse(201, "즐겨찾기를 등록했습니다.", FavoriteResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { MEMBER404_1: "존재하지 않는 유저입니다." })
    @ApiFailure(409, { FAVORITE409_1: "이미 이 영화를 즐겨찾기하셨습니다." })

    @HttpCode(HttpStatus.CREATED)
    async create(@Req() request: AuthenticatedRequest, @Body() dto: CreateFavoriteDto) {
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "즐겨찾기를 등록했습니다.",
            result: await this.favoriteService.create(request.authenticatedMemberId, dto.movieId),
        };
    }

    @Get()
    @ApiOperation({ summary: "내 즐겨찾기 목록 조회" })
    @ApiEnvelopeResponse(200, "즐겨찾기 목록을 조회했습니다.", FavoriteResponseDto, true)

    async list(@Req() request: AuthenticatedRequest) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "즐겨찾기 목록을 조회했습니다.",
            result: await this.favoriteService.list(request.authenticatedMemberId),
        };
    }

    @Get(":movieId")
    @ApiOperation({ summary: "영화별 즐겨찾기 여부 조회" })
    @ApiParam({ name: "movieId", type: Number, example: 550 })
    @ApiEnvelopeResponse(200, "즐겨찾기 여부를 조회했습니다.", FavoriteStatusResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })

    async status(
        @Req() request: AuthenticatedRequest,
        @Param("movieId", ParseIntPipe) movieId: number,
    ) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "즐겨찾기 여부를 조회했습니다.",
            result: await this.favoriteService.status(request.authenticatedMemberId, movieId),
        };
    }

    @Delete(":movieId")
    @ApiOperation({ summary: "영화 즐겨찾기 해제" })
    @ApiParam({ name: "movieId", type: Number, example: 550 })
    @ApiEnvelopeResponse(200, "즐겨찾기를 해제했습니다.")
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { FAVORITE404_1: "해당 즐겨찾기를 찾을 수 없습니다." })

    @HttpCode(HttpStatus.OK)
    async delete(
        @Req() request: AuthenticatedRequest,
        @Param("movieId", ParseIntPipe) movieId: number,
    ) {
        await this.favoriteService.delete(request.authenticatedMemberId, movieId);
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "즐겨찾기를 해제했습니다.",
            result: null,
        };
    }
}
