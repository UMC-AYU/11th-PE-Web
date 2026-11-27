// src/entity/favorite.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  type Relation,
} from 'typeorm';
import { BaseTimeEntity } from './base-time.entity.js';
import { Member } from './member.entity.js';

@Entity('favorite')
@Unique('uk_favorite_member_movie', ['member', 'movieId'])
export class Favorite extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'favorite_id' })
  favoriteId: number;

  // 즐겨찾기의 주인은 로그인한 회원입니다.
  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  // ESM에서 엔티티끼리 import할 때 초기화 순서 오류를 막기 위해 Relation<>으로 감쌉니다.
  member: Relation<Member>;

  // TMDB의 영화 ID를 그대로 저장합니다. 우리 DB의 외래 키는 아닙니다.
  @Column({ name: 'movie_id' })
  movieId: number;
}
