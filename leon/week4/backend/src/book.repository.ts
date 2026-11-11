import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class BookRepository {
    constructor(
        @InjectRepository(Book)
        private readonly books: Repository<Book>,
        @InjectRepository(Category)
        private readonly categories: Repository<Category>,
    ) {}

    findAll(keyword?: string): Promise<Book[]> {
        return this.books.find({
            relations: { category: true },
            where: keyword ? { title: Like(`%${keyword}%`) } : {},
            order: { createdAt: 'DESC', bookId: 'DESC' },
        });
    }

    findByCategory(categoryId: number): Promise<Book[]> {
        return this.books.find({
            relations: { category: true },
            where: { category: { categoryId } },
            order: { createdAt: 'DESC', bookId: 'DESC' },
        });
    }

    findCategory(categoryId: number): Promise<Category | null> {
        return this.categories.findOneBy({ categoryId });
    }

    titleExists(title: string): Promise<boolean> {
        return this.books.existsBy({ title });
    }

    create(
        category: Category,
        title: string,
        description: string,
    ): Promise<Book> {
        return this.books.save(
            this.books.create({
                category,
                title,
                description,
                isAvailable: true,
            }),
        );
    }
}
