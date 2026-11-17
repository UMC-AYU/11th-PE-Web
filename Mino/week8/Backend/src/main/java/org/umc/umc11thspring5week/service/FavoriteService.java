package org.umc.umc11thspring5week.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.umc.umc11thspring5week.dto.CreateFavoriteRequest;
import org.umc.umc11thspring5week.dto.FavoriteResponse;
import org.umc.umc11thspring5week.dto.FavoriteStatusResponse;
import org.umc.umc11thspring5week.entity.Favorite;
import org.umc.umc11thspring5week.entity.Member;
import org.umc.umc11thspring5week.exception.BusinessException;
import org.umc.umc11thspring5week.repository.FavoriteRepository;
import org.umc.umc11thspring5week.repository.MemberRepository;

import java.util.List;

import static org.umc.umc11thspring5week.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(PROFILE_NOT_FOUND));
        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new BusinessException(DUPLICATE_FAVORITE);
        }

        Favorite favorite = new Favorite(member, request.movieId());
        return FavoriteResponse.from(favoriteRepository.saveAndFlush(favorite));
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        return new FavoriteStatusResponse(
                favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)
        );
    }

    @Transactional
    public void delete(Long memberId, Long movieId) {
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new BusinessException(FAVORITE_NOT_FOUND));
        favoriteRepository.delete(favorite);
    }
}
