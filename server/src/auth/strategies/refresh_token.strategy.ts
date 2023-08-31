import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import {Request} from 'express';
import { Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([req => req.cookies['jwt-refresh']]),
      passReqToCallback: true,
      secretOrKey: 'THIS IS SECRET KEY! IN PROD MUST BE CHANGE'
    });
  }

  validate(req: Request, payload: any) {
    // const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      ...payload,
      // refreshToken
    };
  }
}
