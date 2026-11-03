package org.umc.umc11thspring5week.service;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.umc.umc11thspring5week.dto.RatingResponse;
import org.umc.umc11thspring5week.repository.MemberRepository;
import org.umc.umc11thspring5week.repository.RatingRepository;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Page<RatingResponse> getRatingsByMember(Long memberId, int page, int size) {
        if (!memberRepository.existsById(memberId)) {
            // @RestControllerAdvice로 예외를 한 곳에서 다루는 방법은 6주차에 배웁니다.
            // 지금은 Spring이 기본 제공하는 ResponseStatusException으로 404를 바로 응답합니다.
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "ratingId")
        );

        return ratingRepository.findByMember_MemberId(memberId, pageable)
                .map(RatingResponse::from);
    }
}
