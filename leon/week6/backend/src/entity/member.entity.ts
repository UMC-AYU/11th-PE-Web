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

  // 기존 데모 회원에는 비밀번호가 없어 nullable로 둡니다. 신규 회원은 항상 해시를 저장합니다.
  @Column({ type: 'text', nullable: true, select: false })
  password: string | null;

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Rating[];
}
