import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signin({ username }: any) {
    const [userInfo] = await this.userService.findByUserName(username);
    console.log('params：登录查询', userInfo);
    if (!userInfo) {
      throw new HttpException('用户不存在', 400);
    }

    return {
      access_token: await this.jwtService.signAsync({
        username: userInfo.username,
        id: userInfo.id,
      }),
    };
  }

  async signup({ username, password }: any) {
    const res = await this.userService.createUser({ username, password });
    console.log('params：注册查询', username);
    return res;
  }
}
