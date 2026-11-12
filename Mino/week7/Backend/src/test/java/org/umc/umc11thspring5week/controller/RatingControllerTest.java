package org.umc.umc11thspring5week.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.umc.umc11thspring5week.auth.JwtProvider;
import org.umc.umc11thspring5week.dto.RatingResponse;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.exception.ErrorCode;
import org.umc.umc11thspring5week.service.RatingService;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(RatingController.class)
class RatingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RatingService ratingService;

    @MockitoBean
    private JwtProvider jwtProvider;

    @Test
    void returnsRequestedRatingPage() throws Exception {
        RatingResponse rating = new RatingResponse(
                7L, 101L, 5, "인생 영화!",
                LocalDateTime.of(2026, 10, 19, 20, 0),
                LocalDateTime.of(2026, 10, 19, 20, 0)
        );
        when(ratingService.getRatingsByMember(1L, 0, 10))
                .thenReturn(new PageImpl<>(List.of(rating), PageRequest.of(0, 10), 1));

        mockMvc.perform(get("/members/1/ratings?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].ratingId").value(7))
                .andExpect(jsonPath("$.content[0].movieId").value(101))
                .andExpect(jsonPath("$.content[0].score").value(5))
                .andExpect(jsonPath("$.number").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(ratingService).getRatingsByMember(1L, 0, 10);
    }

    @Test
    void rejectsInvalidPaginationBeforeServiceCall() throws Exception {
        mockMvc.perform(get("/members/1/ratings?page=-1&size=101"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(ratingService);
    }

    @Test
    void rejectsScoreOutsideOneToFive() throws Exception {
        when(jwtProvider.parseMemberId("token-a")).thenReturn(1L);
        mockMvc.perform(post("/ratings")
                        .header("Authorization", "Bearer token-a")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"movieId": 101, "score": 6, "comment": "초과 별점"}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON400"))
                .andExpect(jsonPath("$.message").value("별점은 5점 이하여야 합니다."));
    }

    @Test
    void deletingRatingReturnsCommonResponse() throws Exception {
        when(jwtProvider.parseMemberId("token-a")).thenReturn(1L);
        mockMvc.perform(delete("/ratings/7")
                        .header("Authorization", "Bearer token-a"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").value(org.hamcrest.Matchers.nullValue()));

        verify(ratingService).deleteRating(1L, 7L);
    }

    @Test
    void updatingAnotherMembersRatingReturnsForbidden() throws Exception {
        when(jwtProvider.parseMemberId("token-b")).thenReturn(2L);
        when(ratingService.updateRating(org.mockito.ArgumentMatchers.eq(2L),
                org.mockito.ArgumentMatchers.eq(7L), any()))
                .thenThrow(new BusinessException(ErrorCode.RATING_FORBIDDEN));

        mockMvc.perform(patch("/ratings/7")
                        .header("Authorization", "Bearer token-b")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"score": 4, "comment": "수정 시도"}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("RATING403_1"));
    }
}
