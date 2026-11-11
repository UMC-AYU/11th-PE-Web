import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './database.provider';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';
import { RentalRepository } from './rental.repository';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get<string>('DB_HOST', 'localhost'),
                port: Number(config.get<string>('DB_PORT', '3306')),
                username: config.get<string>('DB_USER', 'root'),
                password: config.get<string>('DB_PASSWORD', ''),
                database: config.get<string>('DB_NAME', 'umc11th'),
                entities: [Book, Category],
                synchronize: false,
            }),
        }),
        TypeOrmModule.forFeature([Book, Category]),
    ],
    controllers: [AppController, BookController, RentalController],
    providers: [
        ...databaseProviders,
        AppService,
        BookService,
        BookRepository,
        RentalService,
        RentalRepository,
    ],
    exports: [...databaseProviders],
})
export class AppModule {}
