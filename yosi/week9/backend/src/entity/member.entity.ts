// src/entity/member.entity.ts
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { BaseTimeEntity } from './base-time.entity.js';
import { Rating } from './rating.entity.js';

@Entity('member') // 기존 member 테이블과 연결
export class Member extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: 'member_id' })
  memberId: number;

  @Column({ unique: true, length: 254 })
  email: string;

  // 비밀번호 해시는 응답 DTO에 절대 포함하지 않습니다.
  @Column({ length: 60 })
  password: string;

  @Column({ unique: true, length: 50 })
  nickname: string;

  // 회원 한 명(1)은 평점 여러 개(N)를 남길 수 있습니다.
  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Relation<Rating[]>;
}
