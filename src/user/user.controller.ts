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
  LoggerService,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { Logger } from 'nestjs-pino';

@Controller('user')
export class UserController {
  // private logger = new Logger('用户模块');
  constructor(
    private userService: UserService,
    private config: ConfigService,
    private logger: Logger, // private readonly logger: LoggerService,
  ) {
    this.logger.log('userController init.....');
  }

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
    this.logger.log('请求');
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

  // 多表查询（一对一）
  @Get('profile/:id')
  async getUserProfile(@Param() { id }) {
    return this.userService.findProfile(id);
  }
  // 多表查询（多对一）
  @Get('logs/:id')
  async getUserLogs(@Param() { id }) {
    return this.userService.findLogs(id);
  }
}
