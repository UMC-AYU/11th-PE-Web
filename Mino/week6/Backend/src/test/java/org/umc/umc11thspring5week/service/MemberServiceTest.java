package org.umc.umc11thspring5week.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.umc.umc11thspring5week.dto.SignUpRequest;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.MemberRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private MemberService memberService;

    @Test
    void signUpHashesPasswordAndReturnsResponseWithoutPassword() {
        SignUpRequest request = new SignUpRequest("new@umc.com", "Umc!1234", "무비팬");
        when(passwordEncoder.encode("Umc!1234")).thenReturn("$2a$10$hashed-password");
        when(memberRepository.saveAndFlush(org.mockito.ArgumentMatchers.any(Member.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var response = memberService.signUp(request);

        ArgumentCaptor<Member> captor = ArgumentCaptor.forClass(Member.class);
        verify(memberRepository).saveAndFlush(captor.capture());
        assertThat(captor.getValue().getPassword()).startsWith("$2a$10$");
        assertThat(response.email()).isEqualTo("new@umc.com");
        assertThat(response.nickname()).isEqualTo("무비팬");
    }

    @Test
    void duplicateEmailAndNicknameUseDifferentErrorCodes() {
        SignUpRequest request = new SignUpRequest("used@umc.com", "Umc!1234", "중복닉");
        when(memberRepository.existsByEmail("used@umc.com")).thenReturn(true);

        assertThatThrownBy(() -> memberService.signUp(request))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode.code")
                .isEqualTo("MEMBER4091");

        verify(memberRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void duplicateNicknameUsesNicknameSpecificCode() {
        SignUpRequest request = new SignUpRequest("new@umc.com", "Umc!1234", "중복닉");
        when(memberRepository.existsByNickname("중복닉")).thenReturn(true);

        assertThatThrownBy(() -> memberService.signUp(request))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode.code")
                .isEqualTo("MEMBER4092");

        verify(memberRepository, never()).saveAndFlush(org.mockito.ArgumentMatchers.any());
    }
}
