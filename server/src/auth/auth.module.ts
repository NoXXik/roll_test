import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, RefreshTokenStrategy } from "./strategies";
import { JwtModule } from "@nestjs/jwt";
// import { UserService } from "../user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SessionSerializer } from "./serializer/session.serializer";
import User from "../user/entities/user.entity";
import {UserService} from "../user/user.service";
import {SteamStrategy} from "./strategies/steam.strategy";


@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, SessionSerializer, UserService, SteamStrategy ],
  exports: [AuthService],
})
export class AuthModule {}
