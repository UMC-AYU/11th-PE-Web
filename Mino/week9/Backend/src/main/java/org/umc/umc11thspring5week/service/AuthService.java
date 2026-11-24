package org.umc.umc11thspring5week.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.umc.umc11thspring5week.auth.JwtProvider;
import org.umc.umc11thspring5week.dto.LoginRequest;
import org.umc.umc11thspring5week.dto.LoginResponse;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.MemberRepository;

import static org.umc.umc11thspring5week.exception.ErrorCode.INVALID_CREDENTIALS;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new BusinessException(INVALID_CREDENTIALS);
        }
        return new LoginResponse(member.getNickname(), jwtProvider.issue(member.getMemberId()));
    }
}
