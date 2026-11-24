package org.umc.umc11thspring5week.dto;

import org.umc.umc11thspring5week.entity.Member;

import java.time.LocalDateTime;

public record MemberInfoResponse(String email, String nickname, LocalDateTime createdAt) {
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(member.getEmail(), member.getNickname(), member.getCreatedAt());
    }
}
