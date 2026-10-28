import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { SearchBooksDto } from './dto/search-books.dto';

@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Get()
    getBooks(@Query() query: SearchBooksDto): Promise<BookResponseDto[]> {
        return this.bookService.getAllBooks(query.keyword);
    }

    @Get('category/:categoryId')
    getBooksByCategory(
        @Param('categoryId', ParseIntPipe) categoryId: number,
    ): Promise<BookResponseDto[]> {
        return this.bookService.getBooksByCategory(categoryId);
    }

    @Post()
    createBook(@Body() body: CreateBookDto): Promise<BookResponseDto> {
        return this.bookService.createBook(body);
    }
}
