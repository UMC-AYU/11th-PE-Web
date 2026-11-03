package org.umc.umc11thspring5week.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.umc.umc11thspring5week.dto.EmailCheckResponse;
import org.umc.umc11thspring5week.dto.MemberResponse;
import org.umc.umc11thspring5week.dto.NicknameCheckResponse;
import org.umc.umc11thspring5week.service.MemberService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MemberService memberService;

    @Test
    void validNicknameReturnsAvailabilityAndCorsHeader() throws Exception {
        when(memberService.checkNickname("루미")).thenReturn(new NicknameCheckResponse(true));

        mockMvc.perform(get("/members/nickname/{nickname}", "루미")
                        .header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void nicknameOutsideLengthRangeReturnsBadRequestBeforeServiceCall() throws Exception {
        mockMvc.perform(get("/members/nickname/{nickname}", "a"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("닉네임은 2자 이상 12자 이하여야 합니다."));

        verifyNoInteractions(memberService);
    }

    @Test
    void invalidEmailReturnsBadRequestBeforeServiceCall() throws Exception {
        mockMvc.perform(get("/members/email/{email}", "not-an-email"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("올바른 이메일 형식이어야 합니다."));

        verifyNoInteractions(memberService);
    }

    @Test
    void validEmailReturnsAvailability() throws Exception {
        when(memberService.checkEmail("new@umc.com")).thenReturn(new EmailCheckResponse(true));

        mockMvc.perform(get("/members/email/{email}", "new@umc.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void signUpReturnsCreatedWithoutPassword() throws Exception {
        when(memberService.signUp(any()))
                .thenReturn(new MemberResponse(10L, "new@umc.com", "무비팬"));

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "new@umc.com",
                                  "password": "Umc!1234",
                                  "nickname": "무비팬"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.email").value("new@umc.com"))
                .andExpect(jsonPath("$.result.password").doesNotExist());
    }

    @Test
    void invalidPasswordReturnsConsistentBadRequest() throws Exception {
        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "new@umc.com",
                                  "password": "weak",
                                  "nickname": "무비팬"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON400"));
    }

    @Test
    void databaseEmailConstraintViolationUsesChallengeErrorFormat() throws Exception {
        when(memberService.signUp(any())).thenThrow(new DataIntegrityViolationException(
                "constraint violation",
                new RuntimeException("Duplicate entry for key 'uk_member_email'")
        ));

        mockMvc.perform(post("/members")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "race@umc.com",
                                  "password": "Umc!1234",
                                  "nickname": "동시요청"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("MEMBER4091"))
                .andExpect(jsonPath("$.message").value("이미 사용 중인 이메일입니다."));
    }
}
