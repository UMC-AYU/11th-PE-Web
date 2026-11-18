import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { FavoriteController } from './controller/favorite.controller';
import { MemberController } from './controller/member.controller';
import { MovieRecordController } from './controller/movie-record.controller';
import { RatingController } from './controller/rating.controller';
import { Favorite } from './entity/favorite.entity';
import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { FavoriteService } from './service/favorite.service';
import { MemberService } from './service/member.service';
import { MovieRecordService } from './service/movie-record.service';
import { RatingService } from './service/rating.service';
import { SeedService } from './service/seed.service';

const databaseFile = resolve(process.env.DB_FILE ?? 'data/umcine.sqlite');
mkdirSync(dirname(databaseFile), { recursive: true });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: Number(config.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600) },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: databaseFile,
      autoSave: true,
      entities: [Member, Rating, Favorite],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Member, Rating, Favorite]),
  ],
  controllers: [AuthController, MemberController, RatingController, FavoriteController, MovieRecordController],
  providers: [AuthService, AuthGuard, MemberService, RatingService, FavoriteService, MovieRecordService, SeedService],
})
export class AppModule {}
