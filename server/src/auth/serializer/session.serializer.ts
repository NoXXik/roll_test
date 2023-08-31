import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from "../auth.service";
import { UserService } from "../../user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    console.log('Serialize User', user)

    done(null, user.id);
  }

  async deserializeUser(id: any, done: (err: Error, payload: number) => void): Promise<any> {
    const user = await this.userService.getUserById(id)
    return user ? done(null, user.id) : done(null, null)
  }
}
