import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from './database.provider';

@Injectable()
export class RentalRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly pool: Pool) {}

    async create(memberId: number, bookId: number): Promise<void> {
        const sql =
            'INSERT INTO rent (member_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))';
        await this.pool.execute(sql, [memberId, bookId]);
    }

    async markReturned(rentalId: number): Promise<void> {
        const sql = 'UPDATE rent SET returned_at = NOW() WHERE rent_id = ?';
        await this.pool.execute(sql, [rentalId]);
    }
}
