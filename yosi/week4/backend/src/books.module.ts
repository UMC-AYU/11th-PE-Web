// src/books.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity.js';
import { Category } from './category.entity.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';

@Module({
  // 이 모듈에서 Book, Category 엔티티의 Repository를 주입받을 수 있게 가져옵니다.
  imports: [TypeOrmModule.forFeature([Book, Category])],
  controllers: [BookController],
  providers: [BookService],
})
export class BooksModule {}
