package org.umc.umc11thspring5week.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.umc.umc11thspring5week.entity.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
