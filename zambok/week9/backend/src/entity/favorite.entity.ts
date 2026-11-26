import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { BaseTimeEntity } from "./base-time.entity";
import { Member } from "./member.entity";

@Entity("favorite")
@Index("UQ_favorite_member_movie", ["member", "movieId"], { unique: true })
export class Favorite extends BaseTimeEntity {
    @PrimaryGeneratedColumn({ name: "favorite_id" })
    favoriteId: number;

    @ManyToOne(() => Member, { nullable: false })
    @JoinColumn({ name: "member_id", foreignKeyConstraintName: "FK_favorite_member" })
    member: Member;

    @Column({ name: "movie_id" })
    movieId: number;
}
