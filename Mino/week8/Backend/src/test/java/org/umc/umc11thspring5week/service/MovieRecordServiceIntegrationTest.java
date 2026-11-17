package org.umc.umc11thspring5week.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.umc.umc11thspring5week.dto.CreateMovieRecordRequest;
import org.umc.umc11thspring5week.dto.MovieRecordResponse;
import org.umc.umc11thspring5week.entity.Favorite;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.repository.FavoriteRepository;
import org.umc.umc11thspring5week.repository.MemberRepository;
import org.umc.umc11thspring5week.repository.RatingRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:week8;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "jwt.secret=week8-integration-test-signing-key-at-least-32-bytes"
})
class MovieRecordServiceIntegrationTest {

    @Autowired
    private MovieRecordService movieRecordService;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @MockitoSpyBean
    private FavoriteRepository favoriteRepository;

    private Member member;

    @BeforeEach
    void setUp() {
        favoriteRepository.deleteAllInBatch();
        ratingRepository.deleteAllInBatch();
        memberRepository.deleteAllInBatch();
        member = memberRepository.saveAndFlush(new Member("transaction@example.test", "test-hash", "트랜잭션"));
    }

    @Test
    void commitsBothRecordsTogether() {
        MovieRecordResponse response = movieRecordService.create(
                member.getMemberId(), new CreateMovieRecordRequest(238L, 5, "함께 저장", true)
        );

        assertThat(response.rating().movieId()).isEqualTo(238L);
        assertThat(response.favorite().movieId()).isEqualTo(238L);
        assertThat(response.favorite().createdAt()).isNotNull();
        assertThat(ratingRepository.count()).isEqualTo(1);
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }

    @Test
    void savesOnlyRatingWhenFavoriteIsNotRequested() {
        favoriteRepository.saveAndFlush(new Favorite(member, 238L));

        MovieRecordResponse response = movieRecordService.create(
                member.getMemberId(), new CreateMovieRecordRequest(238L, 4, null, false)
        );

        assertThat(response.favorite()).isNull();
        assertThat(ratingRepository.count()).isEqualTo(1);
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }

    @Test
    void rollsBackInsertedRatingWhenFavoriteUniqueConstraintFails() {
        favoriteRepository.saveAndFlush(new Favorite(member, 238L));
        // Simulate a concurrent favorite committed after the service's precheck.
        doReturn(false).when(favoriteRepository)
                .existsByMember_MemberIdAndMovieId(member.getMemberId(), 238L);

        assertThatThrownBy(() -> movieRecordService.create(
                member.getMemberId(), new CreateMovieRecordRequest(238L, 5, "롤백 검증", true)
        )).isInstanceOf(DataIntegrityViolationException.class);

        assertThat(ratingRepository.count()).isZero();
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }
}
