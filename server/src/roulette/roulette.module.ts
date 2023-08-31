import { Module } from '@nestjs/common';
import { RouletteGateway } from './roulette.gateway';
import { RouletteService } from './roulette.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import User from "../user/entities/user.entity";
import Game from "./entities/game.entity";
import Bet from "./entities/bet.entity";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Bet])],
  providers: [RouletteGateway, RouletteService, AuthService, JwtService]
})
export class RouletteModule {}
