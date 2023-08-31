import {HttpException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import User from "./entities/user.entity";
import {UserStateDto} from "../auth/dto";
import {stripFields} from "../common/mappers/mapToDto";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User)
                private usersRep: Repository<User>,
    ) {
    }

    async getUserById(id: number): Promise<UserStateDto> {
        const user = await this.usersRep.findOne({
            where: {
                id
            }
        })
        if(!user) {
            throw new HttpException('User Not Found', 403)
        }
        const userDto = stripFields(user, ['password_hash', 'hashed_refresh'])
        console.log('get user', user.id)
        return userDto

    }

    async getUserBets(userId: number) {
        const user = await this.usersRep.findOne({
            where: {id: userId},
            relations: {bets: true}
        })
        return user.bets
    }
}
