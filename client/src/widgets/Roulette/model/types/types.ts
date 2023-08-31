export interface GameState {
    hash: string;
    close_time: number | null;
    bets: Bet[];
    phase: 'spin' | 'betting';
}

export interface Bet {

    user: Player,
    amount: number,
    tickets: number[],
    bet_time: number

}

export interface Player {
    user_id: number,
    balance: number,
    avatar_url: string,
    nickname: string
}

export interface GameResult {
    win_ticket: number,
    user: Player,
    win_amount: number,
    number: number
}

export interface NewGame {
    hash: string,
    close_time: number | null;
}
