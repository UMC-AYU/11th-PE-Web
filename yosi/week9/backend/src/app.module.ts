// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entity/favorite.entity.js';
import { Member } from './entity/member.entity.js';
import { Rating } from './entity/rating.entity.js';
import { AuthController } from './controller/auth.controller.js';
import { FavoriteController } from './controller/favorite.controller.js';
import { MovieRecordController } from './controller/movie-record.controller.js';
import { MemberController } from './controller/member.controller.js';
import { RatingController } from './controller/rating.controller.js';
import { AuthService } from './service/auth.service.js';
import { FavoriteService } from './service/favorite.service.js';
import { MovieRecordService } from './service/movie-record.service.js';
import { MemberService } from './service/member.service.js';
import { RatingService } from './service/rating.service.js';

@Module({
  imports: [
    // 환경 변수(.env)를 애플리케이션 전역에서 사용 가능하도록 설정
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // forFeature로 등록한 엔티티를 자동으로 연결
      synchronize: false, // sql/schema.sql로 만든 테이블을 사용하므로 자동 변경 금지
    }),
    // 도메인 모듈을 따로 두지 않으므로 여기 한 곳에서 두 엔티티의 Repository를 등록합니다.
    TypeOrmModule.forFeature([Member, Rating, Favorite]),

    JwtModule.registerAsync({
      global: true, // 전역 등록해두면 어느 서비스에서든 JwtService를 주입받을 수 있어요.
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // 환경 변수는 문자열이라 초 단위 숫자로 바꿔서 넘깁니다. (3600 = 1시간)
          expiresIn: Number(config.getOrThrow<string>('JWT_ACCESS_EXPIRATION')),
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    MemberController,
    RatingController,
    FavoriteController,
    MovieRecordController,
  ],
  providers: [
    AuthService,
    MemberService,
    RatingService,
    FavoriteService,
    MovieRecordService,
  ],
})
export class AppModule {}
