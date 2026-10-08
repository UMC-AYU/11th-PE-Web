import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookResponseDto } from './dto/book-response.dto';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(private readonly bookRepository: BookRepository) {}

    async getAllBooks(keyword?: string): Promise<BookResponseDto[]> {
        const books = await this.bookRepository.findAll(keyword?.trim());
        return books.map((book) => new BookResponseDto(book));
    }

    async getBooksByCategory(categoryId: number): Promise<BookResponseDto[]> {
        const books = await this.bookRepository.findByCategory(categoryId);
        return books.map((book) => new BookResponseDto(book));
    }

    async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
        const category = await this.bookRepository.findCategory(dto.categoryId);
        if (!category) {
            throw new NotFoundException(
                `카테고리 ${dto.categoryId}를 찾을 수 없습니다.`,
            );
        }

        if (await this.bookRepository.titleExists(dto.title)) {
            throw new ConflictException('이미 등록된 도서 제목입니다.');
        }

        try {
            const book = await this.bookRepository.create(
                category,
                dto.title,
                dto.description,
            );
            return new BookResponseDto(book);
        } catch (error: unknown) {
            // Handle a concurrent insert that passes the earlier existence check.
            if (
                typeof error === 'object' &&
                error !== null &&
                'driverError' in error &&
                typeof error.driverError === 'object' &&
                error.driverError !== null &&
                'code' in error.driverError &&
                error.driverError.code === 'ER_DUP_ENTRY'
            ) {
                throw new ConflictException('이미 등록된 도서 제목입니다.');
            }
            throw error;
        }
    }
}
