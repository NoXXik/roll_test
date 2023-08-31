import {Controller, Get} from '@nestjs/common';
import {GetCurrentUserId} from "../common/decorators";
import {UserService} from "./user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {

    }

    @Get('/bets')
    async getUserBets(@GetCurrentUserId() userId: number) {
        const bets = await this.userService.getUserBets(userId)
        return bets
    }
}
