// src/book.entity.ts
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Category } from './category.entity.js';

@Entity('book') // 기존 book 테이블과 연결
export class Book {
  @PrimaryGeneratedColumn({ name: 'book_id' })
  bookId: number;

  // 도서 여러 권(N)은 하나의 카테고리(1)에 속합니다.
  // category_id 숫자 대신 Category 객체로 관계를 표현합니다.
  @ManyToOne(() => Category, (category) => category.books, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  // ESM에서 두 엔티티가 서로 import할 때 초기화 순서 오류를 막기 위해 Relation<>으로 감쌉니다.
  category: Relation<Category>;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}
