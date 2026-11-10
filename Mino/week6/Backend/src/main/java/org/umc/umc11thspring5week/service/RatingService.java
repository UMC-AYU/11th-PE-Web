package org.umc.umc11thspring5week.service;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.umc.umc11thspring5week.dto.CreateRatingRequest;
import org.umc.umc11thspring5week.dto.RatingResponse;
import org.umc.umc11thspring5week.dto.UpdateRatingRequest;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.entity.Rating;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.MemberRepository;
import org.umc.umc11thspring5week.repository.RatingRepository;

import static org.umc.umc11thspring5week.exception.ErrorCode.DUPLICATE_RATING;
import static org.umc.umc11thspring5week.exception.ErrorCode.MEMBER_NOT_FOUND;
import static org.umc.umc11thspring5week.exception.ErrorCode.RATING_FORBIDDEN;
import static org.umc.umc11thspring5week.exception.ErrorCode.RATING_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public Page<RatingResponse> getRatingsByMember(Long memberId, int page, int size) {
        if (!memberRepository.existsById(memberId)) {
            throw new BusinessException(MEMBER_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "ratingId")
        );

        return ratingRepository.findByMember_MemberId(memberId, pageable)
                .map(RatingResponse::from);
    }

    @Transactional
    public RatingResponse createRating(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(MEMBER_NOT_FOUND));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new BusinessException(DUPLICATE_RATING);
        }

        Rating rating = new Rating(member, request.movieId(), request.score(), request.comment());
        return RatingResponse.from(ratingRepository.saveAndFlush(rating));
    }

    @Transactional
    public RatingResponse updateRating(Long memberId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = findRatingAndCheckOwner(memberId, ratingId);
        rating.update(request.score(), request.comment());
        return RatingResponse.from(rating);
    }

    @Transactional
    public void deleteRating(Long memberId, Long ratingId) {
        Rating rating = findRatingAndCheckOwner(memberId, ratingId);
        ratingRepository.delete(rating);
    }

    private Rating findRatingAndCheckOwner(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new BusinessException(RATING_NOT_FOUND));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new BusinessException(RATING_FORBIDDEN);
        }
        return rating;
    }
}
