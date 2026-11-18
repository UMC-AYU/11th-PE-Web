import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { Rating } from '../entity/rating.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Member) private readonly members: Repository<Member>,
    @InjectRepository(Rating) private readonly ratings: Repository<Rating>,
  ) {}

  async onModuleInit(): Promise<void> {
    if (process.env.SEED_DEMO_DATA === 'false') return;
    if (await this.members.count()) return;

    const suhyun = await this.members.save(this.members.create({
      nickname: '수현', email: 'suhyun@umc.com',
    }));
    await this.members.save(this.members.create({
      nickname: '노코', email: 'noco@umc.com',
    }));
    await this.ratings.save([
      this.ratings.create({ member: suhyun, movieId: 550, score: 5, review: '다시 보고 싶은 영화예요.' }),
      this.ratings.create({ member: suhyun, movieId: 680, score: 4, review: '배우들의 연기가 좋았어요.' }),
    ]);
  }
}
