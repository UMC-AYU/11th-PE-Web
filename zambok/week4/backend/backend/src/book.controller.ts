import {
    Body,
    Controller,
    Get,
    Post,
} from '@nestjs/common';

import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { BookResponseDto } from './dto/book-response.dto';

@Controller('books')
export class BookController {
    constructor(
        private readonly bookService: BookService,
    ) { }

    @Get()
    async getBooks(): Promise<BookResponseDto[]> {
        return this.bookService.getBooks();
    }

    @Post()
    async createBook(
        @Body() createBookDto: CreateBookDto,
    ): Promise<BookResponseDto> {
        return this.bookService.createBook(createBookDto);
    }
}