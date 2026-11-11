import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Member } from './member.entity';

@Entity('ratings')
@Unique('UQ_rating_member_movie', ['member', 'movieId'])
export class Rating {
  @PrimaryGeneratedColumn({ name: 'rating_id' })
  ratingId: number;

  @Column({ name: 'movie_id', type: 'integer' })
  movieId: number;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'text' })
  review: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Member, (member) => member.ratings, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
