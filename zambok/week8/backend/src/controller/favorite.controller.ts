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

@Controller("favorites")
@UseGuards(AuthGuard)
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post()
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
    async list(@Req() request: AuthenticatedRequest) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "즐겨찾기 목록을 조회했습니다.",
            result: await this.favoriteService.list(request.authenticatedMemberId),
        };
    }

    @Get(":movieId")
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
