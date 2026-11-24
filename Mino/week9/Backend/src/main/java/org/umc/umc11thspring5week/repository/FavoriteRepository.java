package org.umc.umc11thspring5week.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.umc.umc11thspring5week.entity.Favorite;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId, Long movieId);

    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
