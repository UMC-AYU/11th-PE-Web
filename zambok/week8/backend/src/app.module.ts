import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule, type JwtModuleOptions } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Favorite } from "./entity/favorite.entity";
import { Member } from "./entity/member.entity";
import { Rating } from "./entity/rating.entity";

import { AuthController } from "./controller/auth.controller";
import { AuthGuard } from "./guard/auth.guard";
import { AuthService } from "./service/auth.service";
import { FavoriteController } from "./controller/favorite.controller";
import { MovieRecordController } from "./controller/movie-record.controller";
import { MemberController } from "./controller/member.controller";
import { RatingController } from "./controller/rating.controller";

import { FavoriteService } from "./service/favorite.service";
import { MovieRecordService } from "./service/movie-record.service";
import { MemberService } from "./service/member.service";
import { RatingService } from "./service/rating.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const secret = config.get<string>("JWT_SECRET");
        const expiresIn = Number(
          config.get<string>("JWT_ACCESS_EXPIRATION") ?? "3600",
        );

        if (!secret?.trim()) {
          throw new Error("JWT_SECRET 설정이 필요합니다.");
        }

        if (!Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
          throw new Error("JWT_ACCESS_EXPIRATION은 양의 정수(초)여야 합니다.");
        }

        return {
          secret,
          signOptions: { algorithm: "HS256", expiresIn },
          verifyOptions: { algorithms: ["HS256"] },
        };
      },
    }),

    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),

    TypeOrmModule.forFeature([Member, Rating, Favorite]),
  ],

  controllers: [
    MemberController,
    RatingController,
    AuthController,
    FavoriteController,
    MovieRecordController,
  ],

  providers: [
    MemberService,
    RatingService,
    AuthService,
    AuthGuard,
    FavoriteService,
    MovieRecordService,
  ],
})
export class AppModule { }
