import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rating } from './rating.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn({ name: 'member_id' })
  memberId: number;

  @Column({ unique: true })
  nickname: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Rating[];
}
