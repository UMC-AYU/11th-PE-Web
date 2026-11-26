package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberResponse;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
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
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.web.bind.annotation.GetMapping;
import com.umc.movie.dto.MemberUpdateRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입, 중복 확인 및 내 정보 API")
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "닉네임 중복 확인", description = "토큰 없이 호출하는 공개 API입니다. 닉네임을 사용할 수 있으면 available이 true입니다.")
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(summary = "이메일 중복 확인", description = "토큰 없이 호출하는 공개 API입니다. 이메일을 사용할 수 있으면 available이 true입니다.")
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(
            summary = "회원가입",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다."
    )

    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: 회원가입 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 이메일·비밀번호·닉네임 입력 규칙 위반",
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
                    responseCode = "409", description = "MEMBER4091: 이메일 중복, MEMBER4092: 닉네임 중복",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "MEMBER4091", value = """
                            {
                              "isSuccess": false,
                              "code": "MEMBER4091",
                              "message": "이미 사용 중인 이메일입니다.",
                              "result": null
                            }
                            """),
                    @ExampleObject(name = "MEMBER4092", value = """
                            {
                              "isSuccess": false,
                              "code": "MEMBER4092",
                              "message": "이미 사용 중인 닉네임입니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @Operation(summary = "내 정보 조회", description = "토큰이 필요합니다. 로그인한 회원의 이메일, 닉네임, 가입 시각을 조회합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 내 정보 조회 성공"),
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
                            }))
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            // 인터셉터가 request.setAttribute("memberId", ...)로 담아둔 값을 꺼냅니다
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(summary = "내 정보 수정", description = "토큰이 필요합니다. 로그인한 회원의 닉네임을 2~12자로 수정합니다.")
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 내 정보 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "COMMON4001: 닉네임 입력 규칙 위반",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "COMMON4001", value = """
                            {
                              "isSuccess": false,
                              "code": "COMMON4001",
                              "message": "닉네임을 입력해주세요.",
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
                    responseCode = "409", description = "MEMBER409_1: 다른 회원이 이미 사용하는 닉네임",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ApiResponse.class),
                            examples = {
                    @ExampleObject(name = "MEMBER409_1", value = """
                            {
                              "isSuccess": false,
                              "code": "MEMBER409_1",
                              "message": "이미 사용 중인 닉네임입니다.",
                              "result": null
                            }
                            """)
                            }))
    })
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }


}
