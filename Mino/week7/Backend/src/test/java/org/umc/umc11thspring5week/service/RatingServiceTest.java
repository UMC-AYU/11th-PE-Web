package org.umc.umc11thspring5week.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.umc.umc11thspring5week.dto.CreateRatingRequest;
import org.umc.umc11thspring5week.dto.UpdateRatingRequest;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.entity.Rating;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.MemberRepository;
import org.umc.umc11thspring5week.repository.RatingRepository;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    void requestsDescendingRatingPageAndMapsIt() {
        Rating rating = mock(Rating.class);
        when(memberRepository.existsById(1L)).thenReturn(true);
        when(rating.getRatingId()).thenReturn(3L);
        when(rating.getMovieId()).thenReturn(42L);
        when(rating.getScore()).thenReturn(4);
        when(rating.getComment()).thenReturn("좋아요");
        when(ratingRepository.findByMember_MemberId(eq(1L), any(Pageable.class)))
                .thenAnswer(invocation -> {
                    Pageable pageable = invocation.getArgument(1);
                    assertThat(pageable.getPageNumber()).isEqualTo(1);
                    assertThat(pageable.getPageSize()).isEqualTo(5);
                    assertThat(pageable.getSort().getOrderFor("ratingId").getDirection().isDescending()).isTrue();
                    return new PageImpl<>(List.of(rating), pageable, 6);
                });

        var result = ratingService.getRatingsByMember(1L, 1, 5);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().movieId()).isEqualTo(42L);
    }

    @Test
    void missingMemberReturnsNotFound() {
        when(memberRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> ratingService.getRatingsByMember(99L, 0, 10))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("존재하지 않는 회원입니다.");

        verify(memberRepository).existsById(99L);
    }

    @Test
    void duplicateRatingIsRejectedBeforeInsert() {
        Member member = mock(Member.class);
        when(memberRepository.findById(1L)).thenReturn(java.util.Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 101L)).thenReturn(true);

        assertThatThrownBy(() -> ratingService.createRating(
                1L, new CreateRatingRequest(101L, 5, "이미 등록")))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode.code")
                .isEqualTo("RATING409_1");

        verify(ratingRepository, never()).saveAndFlush(any());
    }

    @Test
    void anotherMemberCannotUpdateRating() {
        Rating rating = mock(Rating.class);
        Member owner = mock(Member.class);
        when(ratingRepository.findById(7L)).thenReturn(java.util.Optional.of(rating));
        when(rating.getMember()).thenReturn(owner);
        when(owner.getMemberId()).thenReturn(1L);

        assertThatThrownBy(() -> ratingService.updateRating(
                2L, 7L, new UpdateRatingRequest(4, "수정 시도")))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode.code")
                .isEqualTo("RATING403_1");
    }

    @Test
    void missingRatingReturnsNotFound() {
        when(ratingRepository.findById(404L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> ratingService.deleteRating(1L, 404L))
                .isInstanceOf(BusinessException.class)
                .extracting("errorCode.code")
                .isEqualTo("RATING404_1");
    }
}
