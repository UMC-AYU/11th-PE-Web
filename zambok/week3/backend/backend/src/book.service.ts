import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository,
    ) { }

    async getBooksByCategory(categoryId: number): Promise<any> {
        return await this.bookRepository.findByCategory(categoryId);
    }
}