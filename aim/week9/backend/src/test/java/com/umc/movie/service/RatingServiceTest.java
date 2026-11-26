package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409와 RATING409_1 예외가 발생하고 저장하지 않는다")
    void createRatingWhenDuplicated() {
        // given: 회원 1이 영화 550에 이미 평점을 남겼습니다.
        Member member = Member.builder()
                .email("rating-unit@example.com")
                .password("test-password")
                .nickname("평점단위")
                .build();
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then: 같은 영화에 등록하면 정해진 상태와 코드의 예외가 발생합니다.
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "재관람")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 403과 RATING403_1 예외가 발생하고 평점을 변경하지 않는다")
    void updateRatingWhenOwnedByAnotherMember() {
        // given: 평점 10의 작성자는 회원 2입니다.
        Member owner = mock(Member.class);
        given(owner.getMemberId()).willReturn(2L);
        Rating rating = Rating.builder()
                .member(owner).movieId(550L).score(3).comment("원래 후기")
                .build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        // when & then: 회원 1이 수정하면 인가 오류가 발생하고 기존 값은 유지됩니다.
        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(5, "바꿀 후기")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(3);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).save(any(Rating.class));
    }
}
