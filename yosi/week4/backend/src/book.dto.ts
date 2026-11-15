// src/book.dto.ts
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import type { Book } from './book.entity.js';

// 요청 DTO: POST /books로 클라이언트가 보내는 데이터의 약속
export class CreateBookDto {
  @IsInt()
  @Type(() => Number)
  categoryId: number;

  // 앞뒤 공백을 지운 뒤 검증해서 "   " 같은 공백만 있는 제목도 빈 제목으로 막습니다.
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// 응답 DTO: 클라이언트에게 돌려줄 데이터의 약속 (DB 컬럼 구조를 그대로 노출하지 않음)
export class BookResponseDto {
  bookId: number;
  title: string;
  description: string | null;
  categoryName: string;
  isAvailable: boolean;

  static from(book: Book): BookResponseDto {
    return {
      bookId: book.bookId,
      title: book.title,
      description: book.description,
      categoryName: book.category.name,
      isAvailable: book.isAvailable,
    };
  }
}
