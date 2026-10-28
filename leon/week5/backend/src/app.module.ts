import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberController } from './controller/member.controller';
import { RatingController } from './controller/rating.controller';
import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { MemberService } from './service/member.service';
import { RatingService } from './service/rating.service';
import { SeedService } from './service/seed.service';

const databaseFile = resolve(process.env.DB_FILE ?? 'data/umcine.sqlite');
mkdirSync(dirname(databaseFile), { recursive: true });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: databaseFile,
      autoSave: true,
      entities: [Member, Rating],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Member, Rating]),
  ],
  controllers: [MemberController, RatingController],
  providers: [MemberService, RatingService, SeedService],
})
export class AppModule {}
