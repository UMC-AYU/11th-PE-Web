// src/book.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity.js';
import { Category } from './category.entity.js';
import { BookResponseDto, type CreateBookDto } from './book.dto.js';

@Injectable()
export class BookService {
  // SQL을 직접 쓰는 대신 TypeORM이 만들어 주는 엔티티 Repository를 주입받습니다.
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    // 카테고리를 함께 조회(JOIN)하고 최신 도서부터 정렬합니다.
    const books = await this.bookRepository.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    // Entity를 그대로 노출하지 않고 응답 DTO로 바꿔서 반환합니다.
    return books.map((book) => BookResponseDto.from(book));
  }

  async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: { category: { categoryId } },
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
    return books.map((book) => BookResponseDto.from(book));
  }

  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    // 1. 요청 DTO 검증은 ValidationPipe가 이미 마쳤습니다.
    // 2. 카테고리 Repository로 categoryId가 존재하는지 확인합니다.
    const category = await this.categoryRepository.findOneBy({
      categoryId: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException(
        `카테고리(categoryId: ${dto.categoryId})를 찾을 수 없습니다.`,
      );
    }

    // 3. Book 엔티티를 생성해 저장합니다.
    const book = this.bookRepository.create({
      category,
      title: dto.title,
      description: dto.description ?? null,
      isAvailable: true,
    });
    const savedBook = await this.bookRepository.save(book);

    // 4. 저장된 엔티티를 응답 DTO로 바꿉니다.
    return BookResponseDto.from(savedBook);
  }
}
