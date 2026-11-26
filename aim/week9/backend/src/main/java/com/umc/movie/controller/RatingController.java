package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록·수정·삭제 및 회원별 조회 API")
public class RatingController {

    private final RatingService ratingService;

    @Operation(summary = "회원별 평점 조회", description = "토큰 없이 호출하는 공개 API입니다. 지정한 회원의 평점을 최신순으로 조회하며, 평점이 없으면 빈 배열을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 목록 조회 성공. 공통 응답 래퍼 없이 배열을 반환합니다."),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "MEMBER404_1: 해당 회원이 존재하지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "MEMBER404_1", value = """
                            {
                              "isSuccess": false,
                              "code": "MEMBER404_1",
                              "message": "해당 회원을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(summary = "평점 등록", description = "토큰이 필요합니다. 로그인한 회원이 TMDB 영화에 1~5점의 평점과 선택 사항인 후기를 등록합니다. memberId는 요청으로 받지 않습니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "COMMON201: 평점 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "평점을 등록했습니다.",
                              "result": {
                                "ratingId": 1,
                                "movieId": 550,
                                "score": 5,
                                "comment": "다시 보고 싶은 영화예요.",
                                "createdAt": "2026-11-26T10:00:00",
                                "updatedAt": "2026-11-26T10:00:00"
                              }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 영화 ID·별점·후기 입력 규칙 위반",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "COMMON4001", value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "별점을 입력해주세요.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "AUTH401_2: 토큰 누락/잘못된 Bearer 형식, AUTH401_3: 유효하지 않은 토큰, AUTH401_4: 토큰 만료",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "AUTH401_2", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "AUTH401_3", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_3",
                              "message": "유효하지 않은 토큰입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "AUTH401_4", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_4",
                              "message": "토큰이 만료되었습니다. 다시 로그인해주세요.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "MEMBER404_1: 토큰의 회원이 존재하지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "MEMBER404_1", value = """
                            {
                              "isSuccess": false,
                              "code": "MEMBER404_1",
                              "message": "해당 회원을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "RATING409_1: 같은 회원이 같은 영화에 평점을 중복 등록함",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "RATING409_1", value = """
                            {
                              "isSuccess": false,
                              "code": "RATING409_1",
                              "message": "이미 이 영화에 평점을 남기셨습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @Operation(summary = "내 평점 수정", description = "토큰이 필요합니다. ratingId에 해당하는 본인의 평점과 후기를 수정합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 평점 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 별점·후기 입력 규칙 위반",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "COMMON4001", value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "별점을 입력해주세요.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "AUTH401_2: 토큰 누락/잘못된 Bearer 형식, AUTH401_3: 유효하지 않은 토큰, AUTH401_4: 토큰 만료",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "AUTH401_2", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "AUTH401_3", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_3",
                              "message": "유효하지 않은 토큰입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "AUTH401_4", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_4",
                              "message": "토큰이 만료되었습니다. 다시 로그인해주세요.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "RATING403_1: 다른 회원이 작성한 평점은 수정할 수 없음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "RATING403_1", value = """
                            {
                              "isSuccess": false,
                              "code": "RATING403_1",
                              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "RATING404_1: 해당 평점이 존재하지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "RATING404_1", value = """
                            {
                              "isSuccess": false,
                              "code": "RATING404_1",
                              "message": "해당 평점을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(summary = "내 평점 삭제", description = "토큰이 필요합니다. ratingId에 해당하는 본인의 평점을 삭제합니다. 성공 시 200 응답의 result는 null입니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 평점 삭제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "AUTH401_2: 토큰 누락/잘못된 Bearer 형식, AUTH401_3: 유효하지 않은 토큰, AUTH401_4: 토큰 만료",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "AUTH401_2", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "AUTH401_3", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_3",
                              "message": "유효하지 않은 토큰입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "AUTH401_4", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_4",
                              "message": "토큰이 만료되었습니다. 다시 로그인해주세요.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403", description = "RATING403_1: 다른 회원이 작성한 평점은 삭제할 수 없음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "RATING403_1", value = """
                            {
                              "isSuccess": false,
                              "code": "RATING403_1",
                              "message": "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "RATING404_1: 해당 평점이 존재하지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "RATING404_1", value = """
                            {
                              "isSuccess": false,
                              "code": "RATING404_1",
                              "message": "해당 평점을 찾을 수 없습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
