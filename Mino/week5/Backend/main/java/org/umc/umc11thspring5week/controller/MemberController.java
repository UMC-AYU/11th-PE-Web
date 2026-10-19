package org.umc.umc11thspring5week.controller;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.umc.umc11thspring5week.dto.EmailCheckResponse;
import org.umc.umc11thspring5week.dto.NicknameCheckResponse;
import org.umc.umc11thspring5week.service.MemberService;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

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
}
