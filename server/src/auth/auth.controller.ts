import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, response, Response } from "express";
import { GetCurrentUserId, GetRefreshToken, Public } from "../common/decorators";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";
import { UserService } from "../user/user.service";
// import User from "../user/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { SteamAuthData } from "./types/types";
import User from "../user/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
              private userService: UserService,
              private configService: ConfigService,
  ) {}

  @Public()
  @Get('/steam/login')
  @UseGuards(AuthGuard('steam'))
  async steamLogin() {
    // The user will be redirected to Steam login page
  }

  @Public()
  @Get('/steam/callback')
  @UseGuards(AuthGuard('steam'))
  async steamLoginCallback(@Req() req: Request, @Res() res) {
    // Successful authentication, handle the user profile here
    const user = req.user as User
    console.log('Steam resp',req.user);
    const tokens = await this.authService.getTokens(user.id, {oauth: 'steam', id: user.steam_id, nickname: user.nickname})
    await this.authService.updateRefreshToken(user.id, tokens.refresh_token)
    // const userDto = mapToDto(user)
    res.cookie('jwt-refresh', tokens.refresh_token, {
      httpOnly: true, // Make the cookie accessible only via HTTP(S) requests
      // Add other cookie options as needed, e.g., maxAge, domain, secure, etc.
    });
    return res.redirect(`${this.configService.get('CLIENT_URL')}`); // Redirect to the main page after successful login
  }


  @Get('/authorization')
  @HttpCode(HttpStatus.OK)
  async authorization(@GetCurrentUserId() userId: number, @Res() res: Response): Promise<any> {
    let data = await this.authService.authorization(userId);
    if (!data) {
      throw new UnauthorizedException();
    }
    return res.json({ access_token: data.tokens.access_token, user: data.user });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() userId: number, @Res() res: Response, @Req() req: Request) {
    res.cookie('jwt-refresh', '');
    await this.authService.logout(userId)
    return res.status(200).json({message: 'logout success'});
  }


  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetRefreshToken() refreshToken: string, @Res() res: Response, @Req() req: Request) {
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }
    const decoded = await this.authService.decodeRefreshToken(refreshToken);
    let tokens = null
    if(decoded.sub) {
      tokens = await this.authService.refreshTokens(decoded.sub, refreshToken)
    }

    if (!tokens) {
      throw new UnauthorizedException();
    }

    // Set the "jwt-refresh" cookie
    res.cookie('jwt-refresh', tokens.refresh_token, {
      httpOnly: true, // Make the cookie accessible only via HTTP(S) requests
      // Add other cookie options as needed, e.g., maxAge, domain, secure, etc.
    });

    return res.json({ access_token: tokens.access_token });
  }

}
