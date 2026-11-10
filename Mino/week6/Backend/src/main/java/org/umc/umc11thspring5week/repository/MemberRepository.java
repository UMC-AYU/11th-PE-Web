package org.umc.umc11thspring5week.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.umc.umc11thspring5week.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);
}
