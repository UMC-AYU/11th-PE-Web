import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository';

@Injectable()
export class RentalService {
    constructor(
        private readonly rentalRepository: RentalRepository,
    ) { }

    async createRental(
        body: Record<string, any>,
    ): Promise<any> {
        const rentalId = await this.rentalRepository.create(
            body.userId,
            body.bookId,
        );

        return {
            message: '도서 대여가 완료되었습니다!',
            rentalId,
        };
    }
}