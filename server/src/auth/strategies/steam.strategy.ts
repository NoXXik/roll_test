import { BadRequestException, HttpException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-steam";
import { ConfigService } from "@nestjs/config";
import { SteamAuthData, SteamProfile } from "../types/types";
import { AuthService } from "../auth.service";
import User from "../../user/entities/user.entity";

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) {
    super({
      returnURL: configService.get('STEAM_CALLBACK_URL'),
      realm: configService.get('STEAM_REALM_URL'),
      apiKey: configService.get('STEAM_API_KEY'),
    });
  }

  async validate(identifier: string, profile: SteamProfile): Promise<User> {
    // console.log(identifier, profile)
    const user = await this.authService.validateSteamUser({ steam_id: profile.id, displayName: profile.displayName, avatar: profile._json.avatarfull });
    if (!user) {
      throw new HttpException("User not found or not created", 400);
    }
    return user || null;
  }
}
