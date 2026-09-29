import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { databaseProviders } from './database.provider';

import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';

import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],

  controllers: [
    BookController,
    RentalController,
  ],

  providers: [
    ...databaseProviders,

    BookService,
    BookRepository,

    RentalService,
    RentalRepository,
  ],

  exports: [
    ...databaseProviders,
  ],
})
export class AppModule { }