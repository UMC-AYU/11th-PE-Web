package org.umc.umc11thspring5week.controller;

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
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/me")
    public ApiResponse<MemberInfoResponse> getMyInfo(@LoginMember Long memberId) {
        return ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId));
    }

    @PatchMapping("/me")
    public ApiResponse<MemberInfoResponse> updateMyInfo(
            @LoginMember Long memberId,
            @Valid @RequestBody MemberUpdateRequest request
    ) {
        return ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request));
    }

    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(
            @PathVariable
            @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하여야 합니다.")
            String nickname
    ) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(
            @PathVariable
            @Email(message = "올바른 이메일 형식이어야 합니다.")
            String email
    ) {
        return memberService.checkEmail(email);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
}
