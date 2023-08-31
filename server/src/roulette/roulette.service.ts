import {Injectable} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {InjectRepository} from "@nestjs/typeorm";
import User from "../user/entities/user.entity";
import {Repository} from "typeorm";
import Bet from "./entities/bet.entity";
import Game from "./entities/game.entity";
import {AuthService} from "../auth/auth.service";

const crypto = require('crypto');

export interface BetPlace {
    amount: number,
    id: number,
    bet_time: number,

}

export interface Player {
    user_id: number,
    balance: number,
    avatar_url: string,
    nickname: string
}


interface IBet {
    user: Player,
    amount: number,
    tickets: number[],
    bet_time: number,

}

@Injectable()
export class RouletteService {
    constructor(@InjectRepository(User)
                private usersRep: Repository<User>,
                @InjectRepository(Bet)
                private betsRep: Repository<Bet>,
                @InjectRepository(Game)
                private gamesRep: Repository<Game>,
                private authService: AuthService) {
    }

    private bettingPhase = false;
    private spinPhase = false;
    private current_game: { hash: string, close_time: number | null, number: number } | null = null;
    private players: Player[] = []
    private bets: { user: Player, amount: number, tickets: number[], bet_time: number }[] = []
    private waitTime = 10;
    private spinningPhaseDuration = 5; // Длительность фазы спина в секундах
    private bet_players: number[] = []
    private timerInterval: NodeJS.Timer;

    private socket: Server;

    setSocket(socket: Server) {
        this.socket = socket;
    }

    startRoulette() {
        this.startBettingPhase();
    }

    async startBettingPhase() {
        console.log('startBettingPhase', this.players)
        this.bets = []
        this.bet_players = []
        this.bettingPhase = true
        this.spinPhase = false
        const number = Math.random()
        const hash = crypto.createHash('sha256').update(String(number)).digest('hex')
        this.current_game = {hash, number, close_time: null}
        this.socket.emit('newGame', {hash: this.current_game.hash, close_time: this.current_game.close_time})
    }

    handleStartTimer() {
        console.log('timer start')
        const currentGame = this.current_game
        this.socket.emit('startTimer', {close_time: this.current_game.close_time});
        setTimeout(() => {
            this.bettingPhase = false;
            this.socket.emit('bettingPhaseEnded', {time: Date.now() + (this.waitTime * 1000)});
            this.handleSpinWheel();
        }, this.waitTime * 1000);
    }

    async handlePlaceBet(client: Socket, dataJSON: BetPlace) {
        if (this.bettingPhase) {
            // Обработка размещения ставки
            if (dataJSON.amount <= 0) {
                return;
            }
            for (let i = 0; i < this.players.length; i++) {
                const player = this.players[i]

                if (player.user_id === dataJSON.id) {
                    if (player.balance < dataJSON.amount) {
                        return;
                    }
                    this.players = this.players.map(player_ => {
                        player_.balance -= dataJSON.amount
                        return player_
                    })
                    const bet: IBet = {
                        amount: dataJSON.amount,
                        user: player,
                        tickets: [this.bets.length > 0 ? this.bets[this.bets.length - 1].tickets[1] + 1 : 0, this.bets.length > 0 ? this.bets[this.bets.length - 1].tickets[1] + 1 + dataJSON.amount : dataJSON.amount],
                        bet_time: dataJSON.bet_time
                    }
                    this.bets.push(bet)

                    this.socket.emit('betPlaced', {
                        ...bet,
                        user: {user_id: bet.user.user_id, avatar_url: bet.user.avatar_url, nickname: bet.user.nickname}},
                        // user: {user_id: player.user_id, avatar_url: player.avatar_url, nickname: player.nickname}
                    );
                    const user = await this.usersRep.findOne({
                        where: {
                            id: bet.user.user_id
                        }
                    })
                    user.balance -= dataJSON.amount
                    await this.usersRep.save(user)
                    this.bet_players.push(player.user_id)
                    const set = new Set(this.bet_players)
                    // console.log('set', set)
                    if (set.size > 1 && this.current_game.close_time === null) {
                        this.current_game.close_time = Date.now() + this.waitTime
                        this.handleStartTimer()
                    }
                }
            }
        } else {
            // Во время фазы спина рулетки
            this.socket.emit('bettingNotAllowed');
        }
        clearInterval(this.timerInterval);
    }

    async handleSpinWheel() {
        console.log('spin')
        this.spinPhase = true;
        this.bettingPhase = false;
        if (this.spinPhase) {
            // Обработка спина рулетки
            const tickets = this.bets[this.bets.length - 1].tickets[1]
            const total_bets = this.bets.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0)
            const win_ticket = Math.floor(tickets * this.current_game.number)
            console.log(tickets, this.bets, win_ticket)
            const win_bet = this.bets.filter(bet => {
                if (bet.tickets[0] <= win_ticket && win_ticket <= bet.tickets[1]) {
                    return bet
                }
            })
            const win_player = this.players.filter(player => player.user_id === win_bet[0].user.user_id)[0]
            this.players = this.players.map(player => {
                if (player.user_id === win_player.user_id) {
                    player.balance += win_bet[0].amount
                }
                return player
            })
            this.socket.emit('gameResult', {
                win_ticket,
                user: win_player,
                win_amount: total_bets,
                number: this.current_game.number
            });
            const user = await this.usersRep.findOne({
                where: {
                    id: win_player.user_id
                }
            })
            user.balance += total_bets
            await this.usersRep.save(user)
            const game = this.gamesRep.create(
                {
                    hash: this.current_game.hash,
                    win_player: {id: win_player.user_id},
                    won: total_bets,
                    bets_amount: total_bets,
                }
            )

            await this.gamesRep.save(game)
            for (const bet of this.bets) {
                let bet_;
                if (bet.tickets[0] === win_bet[0].tickets[0]) {
                    bet_ = this.betsRep.create({
                        user: {id: bet.user.user_id},
                        bet_time: bet.bet_time | 0,
                        bet_amount: bet.amount,
                        game,
                        won: total_bets
                    });
                } else {
                    bet_ = this.betsRep.create({
                        user: {id: bet.user.user_id},
                        bet_time: bet.bet_time | 0,
                        bet_amount: bet.amount,
                        game,
                        won: 0
                    });
                }
                await this.betsRep.save(bet_)
            }
            setTimeout(() => {
                this.startBettingPhase()
            }, this.spinningPhaseDuration * 1000)

        } else {
            // Во время фазы ставок
            this.socket.emit('spinningNotAllowed');
        }
    }

    disconnectPlayer(client: Socket) {
        this.players = this.players.filter(player => player.user_id !== Number(client.handshake.query.id))
    }

    async sendServerState(client: Socket) {
        console.log('serverState')

        let user: User | null = null
        if (client.handshake.query.id) {

            const user_ = this.players.find(user => user.user_id === Number(client.handshake.query.id))
            if (user_) {
                client.disconnect(true)
            }
            console.log('id', client.handshake.query.id)
            user = await this.usersRep.findOne({
                where: {
                    id: Number(client.handshake.query.id)
                }
            })

            this.players.push({
                user_id: user.id,
                balance: user.balance,
                avatar_url: user.avatar_url,
                nickname: user.nickname
            })

            client.emit('serverState', {
                hash: this.current_game.hash,
                close_time: this.current_game.close_time,
                bets: this.bets,
                phase: this.spinPhase ? 'spin' : 'betting',
                players: this.players
            })
        } else {
            client.disconnect(true)
        }
    }

}
