import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider';

@Injectable()
export class BookRepository {
    constructor(
        @Inject(DATABASE_CONNECTION)
        private readonly pool: Pool,
    ) { }

    async findByCategory(categoryId: number): Promise<any> {
        const sql = 'SELECT * FROM book WHERE category_id = ?';

        const [rows] = await this.pool.execute(sql, [categoryId]);

        return rows;
    }
}