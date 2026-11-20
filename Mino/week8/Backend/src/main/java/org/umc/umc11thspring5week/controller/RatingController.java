package org.umc.umc11thspring5week.controller;

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
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/members/{memberId}/ratings")
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
    public ResponseEntity<ApiResponse<RatingResponse>> createRating(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.createRating(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점 등록에 성공했습니다.", response));
    }

    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> updateRating(
            @LoginMember Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.updateRating(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점 수정에 성공했습니다.", response));
    }

    @DeleteMapping("/ratings/{ratingId}")
    public ApiResponse<Void> deleteRating(
            @LoginMember Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.deleteRating(memberId, ratingId);
        return ApiResponse.ok("평점 삭제에 성공했습니다.", null);
    }
}
