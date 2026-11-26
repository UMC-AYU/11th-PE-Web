import { Module } from "@nestjs/common";
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
  imports: [TypeOrmModule.forFeature([Member, Rating, Favorite])],
  controllers: [MemberController, RatingController, AuthController, FavoriteController, MovieRecordController],
  providers: [MemberService, RatingService, AuthService, AuthGuard, FavoriteService, MovieRecordService],
})
export class ApiModule {}
