import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FavoriteResponseDto } from "../dto/favorite-response.dto";
import { FavoriteStatusResponseDto } from "../dto/favorite-status-response.dto";
import { Favorite } from "../entity/favorite.entity";
import { Member } from "../entity/member.entity";
import { ApiException } from "../exception/api.exception";
import { isDuplicateKey } from "../exception/mysql-error";
import { lockMember } from "./member-lock";

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(Favorite)
        private readonly favorites: Repository<Favorite>,
    ) {}

    async create(memberId: number, movieId: number): Promise<FavoriteResponseDto> {
        return this.favorites.manager.transaction(async (manager) => {
            const member = await lockMember(manager, memberId);
            const favorites = manager.getRepository(Favorite);
            await this.assertCanCreate(favorites, memberId, movieId);
            return this.insert(favorites, member, movieId);
        });
    }

    async list(memberId: number): Promise<FavoriteResponseDto[]> {
        const favorites = await this.favorites.find({
            where: { member: { memberId } },
            order: { createdAt: "DESC", favoriteId: "DESC" },
        });
        return favorites.map(FavoriteResponseDto.from);
    }

    async status(memberId: number, movieId: number): Promise<FavoriteStatusResponseDto> {
        this.validateMovieId(movieId);
        const isFavorite = await this.favorites.exists({
            where: { member: { memberId }, movieId },
        });
        return { isFavorite };
    }

    async delete(memberId: number, movieId: number): Promise<void> {
        this.validateMovieId(movieId);
        const result = await this.favorites.createQueryBuilder()
            .delete()
            .where("member_id = :memberId AND movie_id = :movieId", { memberId, movieId })
            .execute();

        if (result.affected === 0) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                "FAVORITE404_1",
                "해당 즐겨찾기를 찾을 수 없습니다.",
            );
        }
    }

    async assertCanCreate(favorites: Repository<Favorite>, memberId: number, movieId: number) {
        if (await favorites.exists({ where: { member: { memberId }, movieId } })) {
            throw this.duplicateFavorite();
        }
    }

    async insert(
        favorites: Repository<Favorite>,
        member: Member,
        movieId: number,
    ): Promise<FavoriteResponseDto> {
        try {
            const favorite = favorites.create({ member, movieId });
            return FavoriteResponseDto.from(await favorites.save(favorite));
        } catch (error) {
            if (isDuplicateKey(error)) throw this.duplicateFavorite();
            throw error;
        }
    }

    private duplicateFavorite(): ApiException {
        return new ApiException(
            HttpStatus.CONFLICT,
            "FAVORITE409_1",
            "이미 이 영화를 즐겨찾기하셨습니다.",
        );
    }

    private validateMovieId(movieId: number): void {
        if (!Number.isInteger(movieId) || movieId < 1 || movieId > 2_147_483_647) {
            throw new BadRequestException("올바르지 않은 영화 ID입니다.");
        }
    }
}
