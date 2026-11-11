import {
    Body,
    Controller,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
    constructor(private readonly rentalService: RentalService) {}

    @Post()
    async createRental(
        @Body('memberId', ParseIntPipe) memberId: number,
        @Body('bookId', ParseIntPipe) bookId: number,
    ): Promise<string> {
        await this.rentalService.createRental(memberId, bookId);
        return '도서 대여 기록이 생성되었습니다!';
    }

    @Patch(':rentalId/return')
    async returnRental(
        @Param('rentalId', ParseIntPipe) rentalId: number,
    ): Promise<string> {
        await this.rentalService.returnRental(rentalId);
        return '도서 반납이 완료되었습니다!';
    }
}
