import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe, VersioningType } from '@nestjs/common';
// import { AllExceptionsFilter } from './exceptions/base.exception.filter';
// import { HttpExceptionFilter } from './exceptions/http.exception.filter';
import { SerializeInterceptor } from './interceptors/serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  await app.listen(8888);
  // 接口版本控制 例如v1
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 异常过滤器 (内部无法使用DI)
  // app.useGlobalFilters(
  //   new AllExceptionsFilter(logger),
  //   new HttpExceptionFilter(),
  // );
  // // 全局管道 (内部无法使用DI)
  app.useGlobalPipes(
    new ValidationPipe({
      // 去除在类上不存在的字段.。就是外界传入的dto有多于字段需要去掉。并且如果dto类中的属性未设置class-validator中的装饰器，那么可不会包括在内
      // 但是经过测试发现不可以丢弃
      whitelist: true, // 保证输入数据的安全性
    }),
  );

  // 这里注册全局拦截器没有用，只能在app.module中进行注册。
  // app.useGlobalInterceptors(new SerializeInterceptor());
}
bootstrap();
