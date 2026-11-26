package com.umc.movie.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RatingApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;
    private String authorizationHeader;

    @BeforeEach
    void setUp() {
        member = memberRepository.save(Member.builder()
                .email("rating-api@example.com")
                .password("test-password-not-used-for-login")
                .nickname("평점통합")
                .build());
        authorizationHeader = "Bearer "
                + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());
    }

    @Test
    @DisplayName("토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답하고 저장하지 않는다")
    void createRatingWithoutToken() throws Exception {
        // given: 올바른 요청 본문은 있지만 인증 헤더는 없습니다.
        CreateRatingRequest request = new CreateRatingRequest(550L, 5, "다시 보고 싶은 영화");

        // when & then: 인증에 실패하고 평점은 저장되지 않습니다.
        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        assertThat(ratingRepository.existsByMember_MemberIdAndMovieId(member.getMemberId(), 550L))
                .isFalse();
    }

    @Test
    @DisplayName("유효한 토큰으로 평점을 등록하면 201과 COMMON201을 응답하고 토큰 회원의 평점을 저장한다")
    void createRatingWithToken() throws Exception {
        // given: 로그인한 회원의 토큰과 평점 등록 요청입니다.
        CreateRatingRequest request = new CreateRatingRequest(550L, 5, "다시 보고 싶은 영화");

        // when & then: 응답과 실제 H2에 저장된 회원·영화·별점을 확인합니다.
        mockMvc.perform(post("/ratings")
                        .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.ratingId").isNumber())
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5))
                .andExpect(jsonPath("$.result.comment").value(request.comment()));
        assertThat(ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(member.getMemberId()))
                .singleElement().satisfies(rating -> {
                    assertThat(rating.getMovieId()).isEqualTo(550L);
                    assertThat(rating.getScore()).isEqualTo(5);
                    assertThat(rating.getComment()).isEqualTo(request.comment());
                    assertThat(rating.getMember().getMemberId()).isEqualTo(member.getMemberId());
                });
    }
}
