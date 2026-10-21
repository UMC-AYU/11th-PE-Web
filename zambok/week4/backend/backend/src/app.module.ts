import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';

import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'umc_week2'),

        entities: [Book, Category],

        synchronize: false,
      }),
    }),

    TypeOrmModule.forFeature([Book, Category]),
  ],

  controllers: [
    AppController,
    BookController,
  ],

  providers: [
    AppService,
    BookService,
  ],
})
export class AppModule { }