import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity('book')
@Index('UQ_book_title', ['title'], { unique: true })
export class Book {
    @PrimaryGeneratedColumn({ name: 'book_id', type: 'bigint' })
    bookId: number;

    @ManyToOne(() => Category, (category) => category.books, {
        nullable: false,
    })
    @JoinColumn({ name: 'category_id', referencedColumnName: 'categoryId' })
    category: Category;

    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;

    @Column({ name: 'is_available', type: 'boolean', default: false })
    isAvailable: boolean;
}
