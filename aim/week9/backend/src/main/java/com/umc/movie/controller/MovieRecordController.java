// src/main/java/com/umc/movie/controller/MovieRecordController.java
package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Tag(name = "영화 기록", description = "평점과 선택적인 즐겨찾기를 함께 저장하는 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @Operation(summary = "영화 기록 등록", description = "토큰이 필요합니다. 로그인한 회원의 평점을 저장하고, addToFavorites가 true이면 즐겨찾기도 같은 트랜잭션에서 저장합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: 영화 기록 등록 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 영화 ID·별점·즐겨찾기 추가 여부 입력 규칙 위반",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "COMMON4001", value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "영화 ID는 필수입니다.",
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
                    responseCode = "409", description = "RATING409_1: 평점 중복, FAVORITE409_1: 함께 추가할 즐겨찾기가 이미 존재함",
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
                            """),
                    @ExampleObject(name = "FAVORITE409_1", value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE409_1",
                              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response = movieRecordService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", response));
    }
}
