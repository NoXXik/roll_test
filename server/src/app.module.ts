import {Module, ValidationPipe} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouletteModule } from './roulette/roulette.module';
import {join} from "path";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import CONNECTION from "./db.connection";
import {APP_GUARD, APP_PIPE} from "@nestjs/core";
import {AccessTokenGuard} from "./common/guards/access-token.guard";
import {SteamStrategy} from "./auth/strategies/steam.strategy";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forRoot({
      ...CONNECTION,
      migrations: [join(__dirname, "src", "migrations", "*.ts")],
      synchronize: false,
      autoLoadEntities: true
    }),
    AuthModule, RouletteModule, UserModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    },
    SteamStrategy
  ],
})
export class AppModule {}
