package org.umc.umc11thspring5week.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.umc.umc11thspring5week.auth.LoginMember;
import org.umc.umc11thspring5week.dto.ApiResponse;
import org.umc.umc11thspring5week.dto.CreateMovieRecordRequest;
import org.umc.umc11thspring5week.dto.MovieRecordResponse;
import org.umc.umc11thspring5week.service.MovieRecordService;

@RestController
@RequiredArgsConstructor
@Tag(name = "8주차 · 영화 기록", description = "평점과 선택적 즐겨찾기를 한 트랜잭션으로 저장")
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @PostMapping("/movie-records")
    @Operation(summary = "영화 기록 저장",
            description = "addToFavorites가 true이면 평점과 즐겨찾기를 함께 저장합니다. "
                    + "어느 저장이든 실패하면 전체 작업을 롤백합니다. false이면 favorite는 null입니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "COMMON201 · 영화 기록 저장 성공", useReturnTypeSchema = true,
                    content = @Content(mediaType = "application/json", examples = {
                            @ExampleObject(name = "평점과 즐겨찾기", value = """
                                    {"isSuccess":true,"code":"COMMON201","message":"영화 기록을 저장했습니다.",
                                     "result":{"rating":{"ratingId":1,"movieId":238,"score":5,
                                     "comment":"다시 보고 싶은 영화입니다.","createdAt":"2026-11-12T14:00:00",
                                     "updatedAt":"2026-11-12T14:00:00"},
                                     "favorite":{"favoriteId":1,"movieId":238,"createdAt":"2026-11-12T14:00:00"}}}
                                    """),
                            @ExampleObject(name = "평점만", value = """
                                    {"isSuccess":true,"code":"COMMON201","message":"영화 기록을 저장했습니다.",
                                     "result":{"rating":{"ratingId":2,"movieId":680,"score":4,"comment":null,
                                     "createdAt":"2026-11-12T14:00:00","updatedAt":"2026-11-12T14:00:00"},
                                     "favorite":null}}
                                    """)
                    })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", ref = "#/components/responses/InvalidInput"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", ref = "#/components/responses/AuthenticationRequired"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/MemberNotFound"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", ref = "#/components/responses/MovieRecordConflict")
    })
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateMovieRecordRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", movieRecordService.create(memberId, request)));
    }
}
