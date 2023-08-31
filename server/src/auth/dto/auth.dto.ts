
export class UserStateDto {
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


export class UserEntity {
  id: number;
  steam_id?: string | null;
  nickname: string;
  avatar_url: string;

  balance: number;
  ban: boolean;
  created_at: Date;

  password_hash: string;
  hashed_refresh: string | null;
  updated_at: string;
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
