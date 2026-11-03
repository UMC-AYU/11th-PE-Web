package org.umc.umc11thspring5week.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.umc.umc11thspring5week.entity.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Page<Rating> findByMember_MemberId(Long memberId, Pageable pageable);
}
