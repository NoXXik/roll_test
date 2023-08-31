import { PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import User from "../../user/entities/user.entity";
import Game from "./game.entity";

@Entity('bets')
class Bet {
    @PrimaryGeneratedColumn()
    id: number;

    // @ManyToOne(() => Game, game => game.id)
    // @JoinColumn({name: 'game_id'})
    // game_id: Game;

    @ManyToOne(() => User, user => user.bets)
    user: User;

    @ManyToOne(() => Game, game => game.bets)
    game: Game;

    // @OneToOne(() => User, user => user.id)
    // @JoinColumn({name: 'player_id'})
    // player_id: User;

    @Column()
    bet_amount: number;

    @Column()
    won: number;

    @Column()
    bet_time: number;

    @Column({ default: () => 'now()' })
    created_at: Date;

    @Column({ default: () => 'now()', onUpdate: 'now()' })
    updated_at: Date;
}

export default Bet;
