package org.umc.umc11thspring5week.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "MEMBER4091", "이미 사용 중인 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "MEMBER4092", "이미 사용 중인 닉네임입니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER4041", "존재하지 않는 회원입니다."),
    DUPLICATE_RATING(HttpStatus.CONFLICT, "RATING4091", "이미 이 영화에 평점을 등록했습니다."),
    RATING_FORBIDDEN(HttpStatus.FORBIDDEN, "RATING4031", "다른 회원의 평점은 수정하거나 삭제할 수 없습니다."),
    RATING_NOT_FOUND(HttpStatus.NOT_FOUND, "RATING4041", "존재하지 않는 평점입니다."),
    DATA_CONFLICT(HttpStatus.CONFLICT, "COMMON409", "이미 존재하는 데이터입니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
