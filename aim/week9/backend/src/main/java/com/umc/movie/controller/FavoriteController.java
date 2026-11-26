// src/main/java/com/umc/movie/controller/FavoriteController.java
package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "즐겨찾기", description = "로그인한 회원의 영화 즐겨찾기 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH) // 이 컨트롤러의 모든 API가 토큰을 요구합니다
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(
            summary = "즐겨찾기 등록",
            description = "토큰이 필요합니다. 토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다. memberId는 요청으로 받지 않습니다."
    )
    // 우리가 만든 공통 응답 DTO 이름도 ApiResponse라서, Swagger 쪽 애노테이션은 풀네임으로 적습니다.
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 영화 ID 누락 또는 양수가 아닌 ID",
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
                    responseCode = "201", description = "즐겨찾기 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "즐겨찾기를 등록했습니다.",
                              "result": { "favoriteId": 1, "movieId": 550, "createdAt": "2026-09-13T21:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "AUTH401_2: 토큰 누락/잘못된 Bearer 형식, AUTH401_3: 유효하지 않은 토큰, AUTH401_4: 토큰 만료. 아래 예시는 토큰 누락 응답입니다.",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 즐겨찾기한 영화",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE409_1",
                              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
                              "result": null
                            }
                            """)))
    })
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 목록 조회", description = "토큰이 필요합니다. 로그인한 회원의 즐겨찾기를 최신순으로 조회하며, 목록이 없으면 result는 빈 배열입니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 내 즐겨찾기 목록 조회 성공"),
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
                            }))
    })
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 등록 여부 조회", description = "토큰이 필요합니다. 로그인한 회원이 TMDB 영화 ID를 즐겨찾기했는지 확인합니다. 등록하지 않았다면 오류 대신 result.isFavorite이 false입니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 등록 여부 조회 성공. 미등록 영화도 정상 응답입니다."),
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
                            }))
    })
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 해제", description = "토큰이 필요합니다. 로그인한 회원의 즐겨찾기를 TMDB 영화 ID로 해제합니다. 성공 시 200 응답의 result는 null입니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 즐겨찾기 해제 성공"),
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
                    responseCode = "404", description = "FAVORITE404_1: 해당 회원이 즐겨찾기한 영화가 아님",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "FAVORITE404_1", value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE404_1",
                              "message": "즐겨찾기한 영화를 찾을 수 없습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
