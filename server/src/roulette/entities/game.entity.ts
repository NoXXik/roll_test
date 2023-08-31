import {PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn, OneToOne, OneToMany} from "typeorm";
import User from "../../user/entities/user.entity";
import Bet from "./bet.entity";

@Entity('games')
class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({name: 'win_player'})
    win_player: User;

    @OneToMany(() => Bet, bet => bet.game)
    bets: Bet[];

    @Column({nullable: false})
    bets_amount: number;

    @Column()
    won: number;

    @Column({nullable: false})
    hash: string;

    @Column({ default: () => 'now()' })
    created_at: Date;

    @Column({ default: () => 'now()', onUpdate: 'now()' })
    updated_at: Date;
}

export default Game;
