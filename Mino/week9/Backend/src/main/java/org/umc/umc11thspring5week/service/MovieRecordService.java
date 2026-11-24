package org.umc.umc11thspring5week.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.umc.umc11thspring5week.dto.CreateMovieRecordRequest;
import org.umc.umc11thspring5week.dto.FavoriteResponse;
import org.umc.umc11thspring5week.dto.MovieRecordResponse;
import org.umc.umc11thspring5week.dto.RatingResponse;
import org.umc.umc11thspring5week.entity.Favorite;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.entity.Rating;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.FavoriteRepository;
import org.umc.umc11thspring5week.repository.MemberRepository;
import org.umc.umc11thspring5week.repository.RatingRepository;

import static org.umc.umc11thspring5week.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(PROFILE_NOT_FOUND));
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new BusinessException(DUPLICATE_RATING);
        }
        if (request.addToFavorites()
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new BusinessException(DUPLICATE_FAVORITE);
        }

        Rating rating = new Rating(member, request.movieId(), request.score(), request.comment());
        Rating savedRating = ratingRepository.saveAndFlush(rating);

        FavoriteResponse favoriteResponse = null;
        if (request.addToFavorites()) {
            Favorite favorite = new Favorite(member, request.movieId());
            favoriteResponse = FavoriteResponse.from(favoriteRepository.saveAndFlush(favorite));
        }

        return new MovieRecordResponse(RatingResponse.from(savedRating), favoriteResponse);
    }
}
