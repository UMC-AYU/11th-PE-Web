import { Book } from '../entities/book.entity';

export class BookResponseDto {
    bookId: number;
    title: string;
    description: string;
    categoryName: string;
    isAvailable: boolean;

    constructor(book: Book) {
        this.bookId = Number(book.bookId);
        this.title = book.title;
        this.description = book.description;
        this.categoryName = book.category.name;
        this.isAvailable = book.isAvailable;
    }
}
