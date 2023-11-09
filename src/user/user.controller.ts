import { ConfigService } from '@nestjs/config';
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import * as config from 'config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private config: ConfigService,
  ) {}
  @Get('range/:num')
  getRange(@Param() params) {
    const { num } = params;
    const envConfig = this.config;
    // console.log(
    //   'db, db_url, user_name',
    //   envConfig.get('DB_PORT'),
    //   envConfig.get('DB'),
    //   envConfig.get('DB_URL'),
    //   envConfig.get('USER_NAME'),
    // );
    console.log('====config', config.get('db.db_url'));
    if (num) {
      const data = this.userService.resultRange(+num);
      return {
        code: 0,
        msg: '请求成功!',
        data,
      };
    }
  }
}
