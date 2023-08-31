import { UserStateDto } from "../dto";

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserAuthRes {
  tokens: Tokens;
  user:  UserStateDto;
}
