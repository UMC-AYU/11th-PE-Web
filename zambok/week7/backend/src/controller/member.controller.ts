import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";

import { MemberService } from "../service/member.service";
import { CreateMemberDto } from "../dto/create-member.dto";
import { UpdateMemberDto } from "../dto/update-member.dto";
import { AuthGuard, type AuthenticatedRequest } from "../guard/auth.guard";
import { RatingService } from "../service/rating.service";

@Controller("members")
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
        private readonly ratingService: RatingService,
    ) { }

    @Get("me")
    @UseGuards(AuthGuard)
    async getMe(@Req() request: AuthenticatedRequest) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "요청 처리에 성공했습니다.",
            result: await this.memberService.getMe(request.authenticatedMemberId),
        };
    }

    @Patch("me")
    @UseGuards(AuthGuard)
    async updateMe(
        @Req() request: AuthenticatedRequest,
        @Body() dto: UpdateMemberDto,
    ) {
        return {
            isSuccess: true,
            code: "COMMON200",
            message: "요청 처리에 성공했습니다.",
            result: await this.memberService.updateMe(request.authenticatedMemberId, dto),
        };
    }

    @Get(":memberId/ratings")
    getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
        return this.ratingService.getRatingsByMember(memberId);
    }

    @Get("nickname/:nickname")
    checkNickname(@Param("nickname") nickname: string) {
        return this.memberService.checkNickname(nickname);
    }

    @Get("email/:email")
    checkEmail(@Param("email") email: string) {
        return this.memberService.checkEmail(email);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() dto: CreateMemberDto) {
        const result = await this.memberService.signUp(dto);

        return {
            isSuccess: true,
            code: "COMMON201",
            message: "회원가입에 성공했습니다.",
            result,
        };
    }
}
