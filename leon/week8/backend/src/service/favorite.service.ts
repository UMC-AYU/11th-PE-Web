import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { FavoriteResponseDto } from '../dto/favorite-response.dto';
import { FavoriteStatusResponseDto } from '../dto/favorite-status-response.dto';
import { Favorite } from '../entity/favorite.entity';
import { Member } from '../entity/member.entity';
import { ApiException } from '../exception/api.exception';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite) private readonly favorites: Repository<Favorite>,
    @InjectRepository(Member) private readonly members: Repository<Member>,
  ) {}

  async create(memberId: number, dto: CreateFavoriteDto): Promise<FavoriteResponseDto> {
    const member = await this.members.findOneBy({ memberId });
    if (!member) throw new ApiException(HttpStatus.NOT_FOUND, 'MEMBER404_1', '해당 회원을 찾을 수 없습니다.');

    if (await this.favorites.exists({ where: { member: { memberId }, movieId: dto.movieId } })) {
      throw new ApiException(HttpStatus.CONFLICT, 'FAVORITE409_1', '이미 이 영화를 즐겨찾기하셨습니다.');
    }

    try {
      const saved = await this.favorites.save(this.favorites.create({ member, movieId: dto.movieId }));
      return FavoriteResponseDto.from(saved);
    } catch (error) {
      if (error instanceof Error && /UNIQUE constraint failed|unique constraint/i.test(error.message)) {
        throw new ApiException(HttpStatus.CONFLICT, 'FAVORITE409_1', '이미 이 영화를 즐겨찾기하셨습니다.');
      }
      throw error;
    }
  }

  async getMyFavorites(memberId: number): Promise<FavoriteResponseDto[]> {
    const favorites = await this.favorites.find({
      where: { member: { memberId } },
      order: { favoriteId: 'DESC' },
    });
    return favorites.map(FavoriteResponseDto.from);
  }

  async getStatus(memberId: number, movieId: number): Promise<FavoriteStatusResponseDto> {
    return FavoriteStatusResponseDto.from(await this.favorites.exists({
      where: { member: { memberId }, movieId },
    }));
  }

  async delete(memberId: number, movieId: number): Promise<void> {
    const result = await this.favorites.delete({ member: { memberId }, movieId });
    if (!result.affected) {
      throw new ApiException(HttpStatus.NOT_FOUND, 'FAVORITE404_1', '즐겨찾기한 영화를 찾을 수 없습니다.');
    }
  }
}
