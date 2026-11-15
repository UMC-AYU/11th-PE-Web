// src/category.entity.ts
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Book } from './book.entity.js';

@Entity('category') // 기존 category 테이블과 연결
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column({ length: 50 })
  name: string;

  // 카테고리 하나(1)에 도서 여러 권(N)이 속합니다.
  @OneToMany(() => Book, (book) => book.category)
  books: Relation<Book[]>;
}
