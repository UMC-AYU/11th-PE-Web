package org.umc.umc11thspring5week.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.umc.umc11thspring5week.dto.ApiResponse;
import org.umc.umc11thspring5week.dto.LoginRequest;
import org.umc.umc11thspring5week.dto.LoginResponse;
import org.umc.umc11thspring5week.service.AuthService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.ok("로그인에 성공했습니다.", authService.login(request));
    }
}
