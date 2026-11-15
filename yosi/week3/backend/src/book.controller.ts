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

@Controller('books') // 이 컨트롤러로 들어오는 기본 주소: /books
export class BookController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly bookService: BookService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  // GET /books/category/1 처럼 경로에 담긴 categoryId를 받습니다.
  // ParseIntPipe가 문자열 "1"을 숫자 1로 바꾸고, 숫자가 아니면 400 에러를 돌려줍니다.
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<any> {
    return await this.bookService.getBooksByCategory(categoryId);
  }

  // HTTP POST 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  // @Body()로 클라이언트가 보낸 JSON Body를 객체로 받습니다.
  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }
}
