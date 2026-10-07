import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database.module.js';
import { BooksModule } from './books.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RentalController } from './rental.controller.js';
import { RentalService } from './rental.service.js';
import { RentalRepository } from './rental.repository.js';

@Module({
  imports: [
    // 환경 변수를 애플리케이션 전역에서 사용 가능하도록 설정
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeORM DB 연결을 루트에 등록합니다.
    // ConfigService로 .env 값을 읽어야 하므로 forRootAsync를 사용합니다.
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: 3306,
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true, // forFeature로 등록한 엔티티를 자동으로 연결
        synchronize: false, // 기존 테이블을 사용하므로 자동 변경 금지
      }),
    }),
    DatabaseModule, // Raw SQL 커넥션 풀 (대여 기능에서 사용)
    BooksModule, // 도서 기능 (Book, Category 엔티티)
  ],
  controllers: [AppController, RentalController],
  providers: [AppService, RentalService, RentalRepository],
})
export class AppModule {}
