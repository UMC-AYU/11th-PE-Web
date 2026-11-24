package org.umc.umc11thspring5week.dto;

import org.umc.umc11thspring5week.entity.Favorite;

import java.time.LocalDateTime;

public record FavoriteResponse(Long favoriteId, Long movieId, LocalDateTime createdAt) {

    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(favorite.getFavoriteId(), favorite.getMovieId(), favorite.getCreatedAt());
    }
}
