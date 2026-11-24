package org.umc.umc11thspring5week.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.umc.umc11thspring5week.auth.LoginMember;
import org.umc.umc11thspring5week.dto.ApiResponse;
import org.umc.umc11thspring5week.dto.EmailCheckResponse;
import org.umc.umc11thspring5week.dto.MemberInfoResponse;
import org.umc.umc11thspring5week.dto.MemberResponse;
import org.umc.umc11thspring5week.dto.MemberUpdateRequest;
import org.umc.umc11thspring5week.dto.NicknameCheckResponse;
import org.umc.umc11thspring5week.dto.SignUpRequest;
import org.umc.umc11thspring5week.service.MemberService;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "회원", description = "회원가입, 중복 확인과 로그인한 회원 정보")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", description = "토큰의 회원 ID로 내 이메일·닉네임·가입 시각을 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "COMMON200 · 내 정보 조회 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/MemberNotFound")
    })
    public ApiResponse<MemberInfoResponse> getMyInfo(@LoginMember Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    @Operation(summary = "내 정보 수정", description = "로그인한 회원의 닉네임을 수정합니다. 본인 닉네임은 다시 사용할 수 있습니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200", description = "COMMON200 · 내 정보 수정 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", ref = "#/components/responses/InvalidInput"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", ref = "#/components/responses/MemberNotFound"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", ref = "#/components/responses/ProfileNicknameConflict")
    })
    public ApiResponse<MemberInfoResponse> updateMyInfo(
            @LoginMember Long memberId,
            @Valid @RequestBody MemberUpdateRequest request
    ) {
        return ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request));
    }

    @GetMapping("/nickname/{nickname}")
    @Operation(summary = "닉네임 중복 확인", description = "닉네임의 사용 가능 여부를 확인합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400", ref = "#/components/responses/InvalidInput")
    public NicknameCheckResponse checkNickname(
            @PathVariable
            @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하여야 합니다.")
            String nickname
    ) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "이메일 중복 확인", description = "이메일의 사용 가능 여부를 확인합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400", ref = "#/components/responses/InvalidInput")
    public EmailCheckResponse checkEmail(
            @PathVariable
            @Email(message = "올바른 이메일 형식이어야 합니다.")
            String email
    ) {
        return memberService.checkEmail(email);
    }

    @PostMapping
    @Operation(summary = "회원가입", description = "이메일·닉네임·비밀번호로 가입합니다. 비밀번호는 bcrypt로 저장합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "COMMON201 · 회원가입 성공", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", ref = "#/components/responses/InvalidInput"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", ref = "#/components/responses/SignUpConflict")
    })
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
}
