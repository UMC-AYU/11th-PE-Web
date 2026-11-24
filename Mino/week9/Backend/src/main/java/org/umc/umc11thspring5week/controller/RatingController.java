package org.umc.umc11thspring5week.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.umc.umc11thspring5week.auth.LoginMember;
import org.umc.umc11thspring5week.dto.ApiResponse;
import org.umc.umc11thspring5week.dto.CreateRatingRequest;
import org.umc.umc11thspring5week.dto.RatingResponse;
import org.umc.umc11thspring5week.dto.UpdateRatingRequest;
import org.umc.umc11thspring5week.service.RatingService;

@Validated
@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "회원별 공개 목록과 로그인한 회원의 평점 등록·수정·삭제")
@ApiResponses(@io.swagger.v3.oas.annotations.responses.ApiResponse(
        responseCode = "400", ref = "#/components/responses/InvalidInput"))
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/members/{memberId}/ratings")
    @Operation(summary = "유저별 평점 조회", description = "지정 회원의 평점을 최신 등록 순서로 페이지 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "공개 평점 페이지 조회 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/PublicMemberNotFound")
    })
    public Page<RatingResponse> getMemberRatings(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") @Min(value = 0, message = "page는 0 이상이어야 합니다.") int page,
            @RequestParam(defaultValue = "10")
            @Min(value = 1, message = "size는 1 이상이어야 합니다.")
            @Max(value = 100, message = "size는 100 이하여야 합니다.") int size
    ) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }

    @PostMapping("/ratings")
    @Operation(summary = "평점 등록", description = "토큰의 회원이 영화에 평점을 남깁니다. 본문에 memberId를 받지 않습니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "COMMON201 · 평점 등록 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/MemberNotFound"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", ref = "#/components/responses/RatingConflict")
    })
    public ResponseEntity<ApiResponse<RatingResponse>> createRating(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.createRating(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점 등록에 성공했습니다.", response));
    }

    @PatchMapping("/ratings/{ratingId}")
    @Operation(summary = "평점 수정", description = "로그인한 회원이 작성한 평점의 별점과 한줄평을 수정합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "COMMON200 · 평점 수정 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", ref = "#/components/responses/RatingForbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/RatingNotFound")
    })
    public ResponseEntity<ApiResponse<RatingResponse>> updateRating(
            @LoginMember Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.updateRating(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점 수정에 성공했습니다.", response));
    }

    @DeleteMapping("/ratings/{ratingId}")
    @Operation(summary = "평점 삭제", description = "로그인한 회원이 작성한 평점을 삭제하고 result: null을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "COMMON200 · 평점 삭제 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", ref = "#/components/responses/RatingForbidden"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/RatingNotFound")
    })
    public ApiResponse<Void> deleteRating(
            @LoginMember Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.deleteRating(memberId, ratingId);
        return ApiResponse.ok("평점 삭제에 성공했습니다.", null);
    }
}
