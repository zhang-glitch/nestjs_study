import { User } from 'src/user/user.entity';
import { ConfigService } from '@nestjs/config';
import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

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
    console.log(
      'db, db_url, user_name',
      envConfig.get('DB_PORT'),
      envConfig.get('DB'),
      envConfig.get('DB_URL'),
      envConfig.get('USER_NAME'),
    );
    if (num) {
      const data = this.userService.resultRange(+num);
      return {
        code: 0,
        msg: '请求成功!',
        data,
      };
    }
  }

  @Get('getAllUser')
  async getAllUser() {
    return this.userService.findAll();
  }

  @Get('getUserById')
  async getUserById(@Query() { id }) {
    return this.userService.findById(id);
  }

  @Post('createUser')
  async createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Put('updateUser')
  async updateUser(@Body() user: User) {
    const id = user.id;
    delete user.id;
    return this.userService.updateUser(id, user);
  }

  @Delete('deleteUserById/:id')
  async deleteUserById(@Param() { id }) {
    return this.userService.removeUser(id);
  }
}
