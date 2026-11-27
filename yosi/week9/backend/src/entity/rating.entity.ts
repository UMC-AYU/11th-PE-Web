// src/entity/rating.entity.ts
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

@Entity('rating') // 기존 rating 테이블과 연결
@Unique('uk_rating_member_movie', ['member', 'movieId']) // 한 회원은 영화 하나에 평점을 하나만 남깁니다.
export class Rating extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'rating_id' })
  ratingId: number;

  // 평점 여러 개(N)는 한 회원(1)에게 속합니다.
  @ManyToOne(() => Member, (member) => member.ratings, { nullable: false })
  @JoinColumn({ name: 'member_id' })
  // ESM에서 두 엔티티가 서로 import할 때 초기화 순서 오류를 막기 위해 Relation<>으로 감쌉니다.
  member: Relation<Member>;

  // TMDB 영화 ID입니다. 영화 테이블이 우리 DB에 없어서 FK가 아닙니다.
  @Column({ name: 'movie_id', type: 'bigint' })
  movieId: number;

  @Column({ type: 'tinyint' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;
}
