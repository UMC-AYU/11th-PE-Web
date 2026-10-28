import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn({ name: 'category_id', type: 'bigint' })
    categoryId: number;

    @Column({ type: 'varchar', length: 10 })
    name: string;

    @OneToMany(() => Book, (book) => book.category)
    books: Book[];
}
