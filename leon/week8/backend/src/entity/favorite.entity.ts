import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseTimeEntity } from './base-time.entity';
import { Member } from './member.entity';

@Entity('favorites')
@Unique('UQ_favorite_member_movie', ['member', 'movieId'])
export class Favorite extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'favorite_id' })
  favoriteId: number;

  @Column({ name: 'movie_id', type: 'integer' })
  movieId: number;

  @ManyToOne(() => Member, (member) => member.favorites, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
