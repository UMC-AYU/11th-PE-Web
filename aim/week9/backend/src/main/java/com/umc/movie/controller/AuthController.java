package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.LoginRequest;
import com.umc.movie.dto.LoginResponse;
import com.umc.movie.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "인증", description = "로그인과 토큰 발급 API")
public class AuthController {

    private final AuthService authService;

    //operation은 메서드 하나의 설명
    @Operation(
            summary = "이메일 로그인",
            description = """
                    토큰 없이 호출하는 공개 API입니다. 이메일과 비밀번호로 로그인하고 Access Token을 발급받습니다.
                    발급받은 토큰은 위쪽 Authorize 버튼에 넣어두면 인증이 필요한 API에 자동으로 실립니다.
                    """
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 로그인 성공 및 Access Token 발급"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 이메일·비밀번호 입력 규칙 위반",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "COMMON4001", value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "이메일을 입력해주세요.",
                              "result": null
                            }
                            """)
                            })),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "AUTH401_1: 이메일 또는 비밀번호가 올바르지 않음",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "AUTH401_1", value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_1",
                              "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @RequestBody @Valid LoginRequest request
    ) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("로그인에 성공했습니다.", response));
    }
}
