// src/rental.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals') // 이 컨트롤러로 들어오는 기본 주소: /rentals
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // POST /rentals 요청의 JSON Body에서 userId, bookId를 받습니다.
  @Post()
  async createRental(@Body() body: Record<string, any>): Promise<string> {
    return await this.rentalService.createRental(body);
  }
}
