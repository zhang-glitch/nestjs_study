// import { Logger } from 'nestjs-pino';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  HttpCode,
  Header,
  Redirect,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

// controler装饰器可以设置路由前缀
// 可以通过nest脚手架生成控制器模板 nest g controller <path>
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private logger: Logger,
  ) {
    this.logger.error('出现错误app');
  }

  // 装饰器将类与所需的元数据相关联，并使 Nest 能够创建路由映射（将请求绑定到相应的控制器）。
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  getInfo(
    @Req() request: Request,
    @Body() body,
    @Query() queryBody,
  ): { name: string; age: number } {
    // @Body() 或 @Query() 获取
    console.log('requrest', request.query, request.params, request.headers);
    console.log('@query', queryBody);
    console.log('@body', body);
    // console.log('requrest', @Body());
    // 返回对象直接序列化。
    return this.appService.getInfo();
  }

  // @Post()
  // getInfo(): @Res({ name:"zh", age: 20 }) {
  //   // 返回对象直接序列化。
  //   // return this.appService.getInfo();
  // }

  // 设置请求状态码
  @Get('getcode')
  // 204 无内容真的就没有内容，即使你响应了内容
  //
  @HttpCode(201)
  getCode() {
    // 返回对象直接序列化。
    // return this.appService.getInfo();
    return 'code';
  }

  // 重定向默认状态码是302，临时重定向。响应的结果是直接是重定向的内容
  @Redirect('https://nestjs.com', 301)
  @Get('redirect')
  getRedirect() {
    return 'redirect';
  }
  // 也可以直接返回url和状态码。但是也需要使用Redirect装饰器，传递空值。即使有值也会被覆盖。
  @Get('redirect2')
  @Redirect()
  getRedirect2() {
    return {
      url: 'https://nestjs.com',
      statusCode: 301,
    };
  }

  // 动态参数
  @Get('params/:id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }
}
