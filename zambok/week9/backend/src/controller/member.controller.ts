import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ApiAuthErrors, ApiEnvelopeResponse, ApiFailure } from "../swagger/responses";
import { CheckResponseDto } from "../dto/check-response.dto";
import { MemberInfoResponseDto } from "../dto/member-info-response.dto";
import { RatingResponseDto } from "../dto/rating-response.dto";
import { SignupResponseDto } from "../dto/signup-response.dto";
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

@ApiTags("회원")
@Controller("members")
export class MemberController {
    constructor(
        private readonly memberService: MemberService,
        private readonly ratingService: RatingService,
    ) { }

    @Get("me")
    @ApiOperation({ summary: "내 프로필 조회" })
    @ApiBearerAuth("access-token")
    @ApiAuthErrors()
    @ApiEnvelopeResponse(200, "요청 처리에 성공했습니다.", MemberInfoResponseDto)
    @ApiFailure(404, { MEMBER404_1: "존재하지 않는 유저입니다." })

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
    @ApiOperation({ summary: "내 닉네임 수정" })
    @ApiBearerAuth("access-token")
    @ApiAuthErrors()
    @ApiEnvelopeResponse(200, "요청 처리에 성공했습니다.", MemberInfoResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { MEMBER404_1: "존재하지 않는 유저입니다." })
    @ApiFailure(409, { MEMBER409_1: "이미 사용 중인 닉네임입니다." })

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
    @ApiOperation({ summary: "회원별 평점 목록 공개 조회", description: "기존 API 형식대로 공통 래퍼 없이 배열을 반환합니다." })
    @ApiParam({ name: "memberId", type: Number, example: 1 })
    @ApiResponse({ status: 200, description: "평점 목록", type: RatingResponseDto, isArray: true })
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(404, { COMMON404: "존재하지 않는 유저입니다." })

    getMemberRatings(@Param("memberId", ParseIntPipe) memberId: number) {
        return this.ratingService.getRatingsByMember(memberId);
    }

    @Get("nickname/:nickname")
    @ApiOperation({ summary: "닉네임 중복 확인" })
    @ApiParam({ name: "nickname", example: "잠복" })
    @ApiResponse({ status: 200, description: "사용 가능 여부 (공통 래퍼 없음)", type: CheckResponseDto })

    checkNickname(@Param("nickname") nickname: string) {
        return this.memberService.checkNickname(nickname);
    }

    @Get("email/:email")
    @ApiOperation({ summary: "이메일 중복 확인" })
    @ApiParam({ name: "email", example: "member@example.com" })
    @ApiResponse({ status: 200, description: "사용 가능 여부 (공통 래퍼 없음)", type: CheckResponseDto })

    checkEmail(@Param("email") email: string) {
        return this.memberService.checkEmail(email);
    }

    @Post()
    @ApiOperation({ summary: "회원가입" })
    @ApiEnvelopeResponse(201, "회원가입에 성공했습니다.", SignupResponseDto)
    @ApiFailure(400, { COMMON400: "요청 값이 올바르지 않습니다." })
    @ApiFailure(409, { MEMBER4091: "이미 사용 중인 이메일입니다.", MEMBER409_1: "이미 사용 중인 닉네임입니다.", COMMON409: "이미 등록된 데이터입니다." })

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
