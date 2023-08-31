import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";

interface JwtPayload {
  sub: string,
  email: string
}
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'THIS IS SECRET KEY! IN PROD MUST BE CHANGE'
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
