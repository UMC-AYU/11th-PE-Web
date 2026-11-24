package org.umc.umc11thspring5week.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.umc.umc11thspring5week.auth.LoginMember;
import org.umc.umc11thspring5week.dto.ApiResponse;
import org.umc.umc11thspring5week.dto.CreateFavoriteRequest;
import org.umc.umc11thspring5week.dto.FavoriteResponse;
import org.umc.umc11thspring5week.dto.FavoriteStatusResponse;
import org.umc.umc11thspring5week.service.FavoriteService;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
@Tag(name = "8주차 · 즐겨찾기", description = "Bearer JWT로 식별한 회원의 즐겨찾기")
@ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "401", ref = "#/components/responses/AuthenticationRequired"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
                responseCode = "400", ref = "#/components/responses/InvalidInput")
})
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    @Operation(summary = "즐겨찾기 등록", description = "요청 본문에는 movieId만 전달합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "COMMON201 · 등록 성공", useReturnTypeSchema = true,
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {"isSuccess":true,"code":"COMMON201","message":"즐겨찾기를 등록했습니다.",
                             "result":{"favoriteId":1,"movieId":550,"createdAt":"2026-11-12T14:00:00"}}
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/MemberNotFound"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", ref = "#/components/responses/FavoriteConflict")
    })
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", favoriteService.create(memberId, request)));
    }

    @GetMapping
    @Operation(summary = "내 즐겨찾기 목록", description = "최신 등록 순서로 반환하며 빈 목록은 result: []입니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 · 목록 조회", useReturnTypeSchema = true,
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                    {"isSuccess":true,"code":"COMMON200","message":"내 즐겨찾기 목록을 조회했습니다.",
                     "result":[{"favoriteId":1,"movieId":550,"createdAt":"2026-11-12T14:00:00"}]}
                    """)))
    public ApiResponse<List<FavoriteResponse>> getMyFavorites(@LoginMember Long memberId) {
        return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId));
    }

    @GetMapping("/{movieId}")
    @Operation(summary = "영화 즐겨찾기 여부", description = "등록하지 않은 영화도 200과 isFavorite: false를 반환합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 · 여부 조회", useReturnTypeSchema = true,
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                    {"isSuccess":true,"code":"COMMON200","message":"즐겨찾기 여부를 조회했습니다.",
                     "result":{"isFavorite":true}}
                    """)))
    public ApiResponse<FavoriteStatusResponse> getStatus(
            @LoginMember Long memberId,
            @PathVariable @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
    }

    @DeleteMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 해제", description = "로그인한 회원과 영화 ID로 관계를 찾아 해제합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "COMMON200 · 해제 성공", useReturnTypeSchema = true,
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {"isSuccess":true,"code":"COMMON200","message":"즐겨찾기를 해제했습니다.","result":null}
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/FavoriteNotFound")
    })
    public ApiResponse<Void> delete(
            @LoginMember Long memberId,
            @PathVariable @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}
