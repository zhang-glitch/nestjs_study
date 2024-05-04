import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/base.exception.filter';
import { HttpExceptionFilter } from './exceptions/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  await app.listen(8888);
  // 接口版本控制 例如v1
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // 异常过滤器
  app.useGlobalFilters(
    new AllExceptionsFilter(logger),
    new HttpExceptionFilter(),
  );
}
bootstrap();
