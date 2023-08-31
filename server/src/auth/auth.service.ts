import {ForbiddenException, HttpException, Injectable} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import {Tokens, UserAuthRes} from "./types";
import {JwtService} from "@nestjs/jwt";
// import { mapToDto } from "../common/mappers/mapToDto";
import {InjectRepository} from "@nestjs/typeorm";
import User from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {SteamUserDetails} from "./types/types";
import {mapToDto} from "../common/mappers/mapToDto";

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User)
                private usersRep: Repository<User>,
                private jwt: JwtService) {
    }

    async validateSteamUser(details: SteamUserDetails) {
        console.log(details)
        const user = await this.usersRep.findOne({
            where: {
                steam_id: details.steam_id,
            }
        })
        if (user) {
            if (user.nickname !== details.displayName) {
                user.nickname = details.displayName
                await this.usersRep.save(user)
            }
            return user;
        }
        const newUser = await this.usersRep.create({
            nickname: details.displayName,
            steam_id: details.steam_id,
            avatar_url: details.avatar,
            password_hash: '',
        })
        newUser.balance = 5000
        await this.usersRep.save(newUser)
        console.log('Новый пользователь Steam создан')

        console.log('new user', newUser)
        return newUser
    }

    async authorization(userId: number): Promise<UserAuthRes> {
        const user = await this.usersRep.findOne({
            where: {id: userId}
        })
        if (!user) {
            throw new ForbiddenException('User not found!')
        }
        const tokens = await this.getTokens(user.id)
        // console.log(tokens)
        await this.updateRefreshToken(user.id, tokens.refresh_token)
        const userDto = mapToDto(user)
        // const userDto = new UserEntity(user)
        return {tokens, user: userDto}
    }

    async logout(userId: number) {
        if (!userId) {
            return new HttpException('Error', 400)
        }
        const user = await this.usersRep.findOne({
            where: {id: userId}
        })
        if (!user) {
            throw new ForbiddenException('User not found!')
        }
        user.hashed_refresh = null
        await this.usersRep.save(user)
        console.log('logout return')
        return true
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
        const user = await this.usersRep.findOne({
            where: {
                id: userId
            }
        })
        if (!user || !user.hashed_refresh) throw new HttpException('Access denied', 401)
        const tokenMatches = await bcrypt.compare(refreshToken, user.hashed_refresh)
        if (!tokenMatches) throw new HttpException('Error not match token', 401)
        const tokens = await this.getTokens(user.id)
        await this.updateRefreshToken(user.id, tokens.refresh_token)
        return tokens

    }

    // @Transactional()
    async updateRefreshToken(userId: number, refreshToken: string) {
        const hash = await this.hashData(refreshToken)
        const user = await this.usersRep.findOne({
            where: {
                id: userId
            }
        })
        if (!user) throw new HttpException('User Not Found', 403)
        user.hashed_refresh = hash
        await this.usersRep.save(user)
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10)
    }

    async decodeRefreshToken(refreshToken: string): Promise<any> {
        const decoded = this.jwt.decode(refreshToken)
        console.log('decoded', decoded)
        return decoded
    }


    async verifyAccessToken(access_token: string): Promise<any> {
        const decoded = this.jwt.verify(access_token, {secret: 'THIS IS SECRET KEY! IN PROD MUST BE CHANGE'})
        console.log('decoded', decoded)
        return decoded

    }

    async getTokens(userId: number, args?: object): Promise<Tokens> {
        const [access, refresh] = await Promise.all([
            this.jwt.signAsync({
                sub: userId,
                ...args
            }, {
                secret: 'THIS IS SECRET KEY! IN PROD MUST BE CHANGE',
                expiresIn: 60 * 15,
            }),
            this.jwt.signAsync({
                sub: userId,
                ...args
            }, {
                secret: 'THIS IS SECRET KEY! IN PROD MUST BE CHANGE',
                expiresIn: 60 * 60 * 24 * 7,
            })
        ])
        return {
            access_token: access,
            refresh_token: refresh
        }
    }
}
