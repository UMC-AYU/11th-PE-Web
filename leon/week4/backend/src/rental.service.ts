import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository';

@Injectable()
export class RentalService {
    constructor(private readonly rentalRepository: RentalRepository) {}

    async createRental(memberId: number, bookId: number): Promise<void> {
        await this.rentalRepository.create(memberId, bookId);
    }

    async returnRental(rentalId: number): Promise<void> {
        await this.rentalRepository.markReturned(rentalId);
    }
}
