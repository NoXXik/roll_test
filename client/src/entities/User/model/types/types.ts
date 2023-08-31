export interface UserState {
    user: User | null;
    access_token: string | null;
}

export interface User {
    id: number;
    steam_id?: string | null;
    nickname: string;
    password_hash: string;
    balance: number;
    avatar_url: string;
    ban: boolean;
    updated_at: string;
    created_at: Date;
}

export interface IUserBet {
  id: number;
  bet_amount: number;
  won: number;
  bet_time: number;
  created_at: string;
  updated_at: string;
};
