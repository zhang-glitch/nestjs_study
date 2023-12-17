import { HttpExceptionFilter } from './filter/http-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import 'winston-daily-rotate-file';
import { join } from 'path';

async function bootstrap() {
  const loggerInstance = createLogger({
    transports: [
      // 控制台输出格式化
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      // 滚动日子，输出到文件
      new winston.transports.DailyRotateFile({
        // 只记录warn级别之后的日志。warn, error
        level: 'warn',
        dirname: join(__dirname, '../logs'),
        filename: 'application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        // 要保留的最大日志数。
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
      // 通过level来区分不同的日志输出
      new winston.transports.DailyRotateFile({
        // 记录全部类型日志
        level: 'info',
        dirname: join(__dirname, '../logs'),
        filename: 'info-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple(),
        ),
      }),
    ],
  });

  const logger = WinstonModule.createLogger({
    instance: loggerInstance,
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });
  // 全局的filter只能有一个
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(8888);
}
bootstrap();
