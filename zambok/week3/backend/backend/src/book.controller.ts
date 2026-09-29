import { Controller, Get, Param } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
    constructor(
        private readonly bookService: BookService,
    ) { }

    @Get('category/:categoryId')
    async getBooksByCategory(
        @Param('categoryId') categoryId: string,
    ): Promise<any> {
        return await this.bookService.getBooksByCategory(
            Number(categoryId),
        );
    }
}