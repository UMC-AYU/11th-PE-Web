import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { CreateMovieRecordDto } from "../dto/create-movie-record.dto";
import { AuthGuard, type AuthenticatedRequest } from "../guard/auth.guard";
import { MovieRecordService } from "../service/movie-record.service";

@Controller("movie-records")
@UseGuards(AuthGuard)
export class MovieRecordController {
    constructor(private readonly movieRecordService: MovieRecordService) {}

    @Post()
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
