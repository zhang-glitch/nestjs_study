import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
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
  Inject,
  LoggerService,
  Res,
  Req,
  Redirect,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response, Request } from 'express';
import { BusinessException } from 'src/exceptions/business.exception';
import { AuthGuard } from '../guards/auth.guard';

@Controller('user')
// 请求守卫
// @UseGuards(AuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private config: ConfigService,
    // 该模块需要等到logger初始化完成之后在进行初始化。
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.error('user init error....');
  }

  // 异常处理
  @Get('error')
  getErr() {
    // 系统抛出错误，非httpException，将被AllExceptionsFilter拦截，httpException将被HttpExceptionFilter拦截
    const a: any = {};
    console.log('a', a.o.p); // 直接http协议报503
    // try {
    //   const a: any = {};
    //   console.log('a', a.o.p);
    // } catch (error) {
    //   console.log('抛出错误!', error);
    //   // 抛出错误后，nestjs会自动为我们创建一个响应。
    //   // {
    //   //   "statusCode": 403,
    //   //   "message": "发生错误"
    //   //   }
    //   // throw new BusinessException('发生错误');
    //   // throw new HttpException('发生错误', 900);
    //   // 只有你自己取抛错误
    //   throw new HttpException( // http协议状态码自己决定
    //     {
    //       name: 'zh',
    //     },
    //     900,
    //   );
    // }
    // return a;
  }
  // 重定向
  // 只要浏览器访问这个接口，状态码为重定向相关，那么就会直接重定向，这是浏览器行为。其他状态码就不会重定向了。
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 200)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Get('demo')
  async getDemoData(@Req() request: Request, @Res() response: Response) {
    console.log('request', request);
    console.log('response', response);
    // return response.send({
    //   name: 'zh',
    // });
    // 只要使用了Res注解，我们必须使用express提供的方法进行响应，都这该请求将被挂起
    // response.send({
    //   name: 'iiii',
    // });
    return '1111';
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
  // 请求守卫
  // @UseGuards(AuthGuard)
  async getAllUser(@Req() req: Request) {
    console.log('===req', req['user']);
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
