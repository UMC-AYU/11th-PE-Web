// src/book.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto, CreateBookDto } from './book.dto.js';

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return await this.bookService.getAllBooks();
  }

  // GET /books/category/1 처럼 경로에 담긴 categoryId를 받습니다.
  // ParseIntPipe가 문자열 "1"을 숫자 1로 바꾸고, 숫자가 아니면 400 에러를 돌려줍니다.
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<BookResponseDto[]> {
    return await this.bookService.getBooksByCategory(categoryId);
  }

  // HTTP POST 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  // @Body()로 받은 JSON은 ValidationPipe가 CreateBookDto 기준으로 검증합니다.
  // NestJS의 POST 핸들러는 기본으로 201 Created를 응답합니다.
  @Post()
  async createBook(@Body() body: CreateBookDto): Promise<BookResponseDto> {
    return await this.bookService.createBook(body);
  }
}
