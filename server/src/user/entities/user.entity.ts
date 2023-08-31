import {PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany} from "typeorm";
import Bet from "../../roulette/entities/bet.entity";

@Entity('users')
class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    steam_id: string | null;

    @Column()
    nickname: string;

    @Column()
    avatar_url: string;


    @Column()
    password_hash: string;

    @Column({default: 0})
    balance: number;

    @Column({ default: false })
    ban: boolean;

    @Column({ nullable: true })
    hashed_refresh: string | null;

    @Column({ default: () => 'now()' })
    created_at: Date;

    @Column({ default: () => 'now()', onUpdate: 'now()' })
    updated_at: Date;

    @OneToMany(() => Bet, bet => bet.user)
    bets: Bet[];
}

export default User;
