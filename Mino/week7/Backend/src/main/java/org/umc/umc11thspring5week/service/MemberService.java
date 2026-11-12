package org.umc.umc11thspring5week.service;


import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.umc.umc11thspring5week.dto.EmailCheckResponse;
import org.umc.umc11thspring5week.dto.MemberInfoResponse;
import org.umc.umc11thspring5week.dto.MemberResponse;
import org.umc.umc11thspring5week.dto.MemberUpdateRequest;
import org.umc.umc11thspring5week.dto.NicknameCheckResponse;
import org.umc.umc11thspring5week.dto.SignUpRequest;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.MemberRepository;

import static org.umc.umc11thspring5week.exception.ErrorCode.DUPLICATE_EMAIL;
import static org.umc.umc11thspring5week.exception.ErrorCode.DUPLICATE_NICKNAME;
import static org.umc.umc11thspring5week.exception.ErrorCode.PROFILE_NICKNAME_CONFLICT;
import static org.umc.umc11thspring5week.exception.ErrorCode.PROFILE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public NicknameCheckResponse checkNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);
        return new NicknameCheckResponse(!exists);
    }

    @Transactional(readOnly = true)
    public EmailCheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);
        return new EmailCheckResponse(!exists);
    }

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new BusinessException(DUPLICATE_EMAIL);
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new BusinessException(DUPLICATE_NICKNAME);
        }

        Member member = new Member(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname()
        );

        return MemberResponse.from(memberRepository.saveAndFlush(member));
    }

    @Transactional(readOnly = true)
    public MemberInfoResponse getMyInfo(Long memberId) {
        return MemberInfoResponse.from(findProfile(memberId));
    }

    @Transactional
    public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = findProfile(memberId);
        if (memberRepository.existsByNicknameAndMemberIdNot(request.nickname(), memberId)) {
            throw new BusinessException(PROFILE_NICKNAME_CONFLICT);
        }

        member.updateNickname(request.nickname());
        try {
            memberRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException(PROFILE_NICKNAME_CONFLICT);
        }
        return MemberInfoResponse.from(member);
    }

    private Member findProfile(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(PROFILE_NOT_FOUND));
    }
}
