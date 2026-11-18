import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

import { CreateMovieRecordDto } from "../dto/create-movie-record.dto";
import { MovieRecordResponseDto } from "../dto/movie-record-response.dto";
import { Favorite } from "../entity/favorite.entity";
import { Rating } from "../entity/rating.entity";
import { FavoriteService } from "./favorite.service";
import { lockMember } from "./member-lock";
import { RatingService } from "./rating.service";

@Injectable()
export class MovieRecordService {
    constructor(
        private readonly dataSource: DataSource,
        private readonly ratingService: RatingService,
        private readonly favoriteService: FavoriteService,
    ) {}

    async create(memberId: number, dto: CreateMovieRecordDto): Promise<MovieRecordResponseDto> {
        return this.dataSource.transaction(async (manager) => {
            // Acquiring this lock first also serializes writes through the standalone create APIs.
            const member = await lockMember(manager, memberId);
            const ratings = manager.getRepository(Rating);
            const favorites = manager.getRepository(Favorite);

            await this.ratingService.assertCanCreate(ratings, memberId, dto.movieId);
            if (dto.addToFavorites) {
                await this.favoriteService.assertCanCreate(favorites, memberId, dto.movieId);
            }

            const rating = await this.ratingService.insert(ratings, member, dto);
            const favorite = dto.addToFavorites
                ? await this.favoriteService.insert(favorites, member, dto.movieId)
                : null;

            return { rating, favorite };
        });
    }
}
