import { LogsModule } from './logs/logs.module';
import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotEnv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { HttpExceptionFilter } from './exceptions/http.exception.filter';
import { AllExceptionsFilter } from './exceptions/base.exception.filter';

// import { User } from './user/user.entity';
// import { Roles } from './roles/roles.entity';
// import { Logs } from './logs/logs.entity';
// import { Profile } from './user/profile.entity';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './guards/auth.guard';
const entities =
  process.env.NODE_ENV === 'test'
    ? [__dirname + '/**/*.entity.ts']
    : [__dirname + '/**/*.entity{.js,.ts}'];

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  // 导入模块
  // ConfigModule.forRoot 加载环境变量
  imports: [
    ConfigModule.forRoot({
      // 将环境变量在全部文件模块中导入
      isGlobal: true,
      // 设置读取的环境变量文件
      // 如果在多个文件中发现同一个变量，则第一个变量优先。
      envFilePath,
      // 加载自定义配置文件数组。这里可以加载提取出的相同配置文件属性,dotEnv.config({ path: '.env' })将环境变量加载到process.env中
      load: [() => dotEnv.config({ path: '.env' })],
      // 验证环境变量(只能验证特定环境的配置文件，不能验证load中加载的)
      validationSchema: Joi.object({
        // 验证DB_PORT变量，并设置默认值为3306
        DB_PORT: Joi.number().valid(3306),
      }),
    }),
    // 配置数据库连接信息
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'root',
    //   password: 'ZH123456',
    //   database: 'blog',
    //   entities: [],
    //   // 同步本地的schema与数据库 -> 初始化的时候去使用
    //   synchronize: true,
    //   // 日志等级
    //   logging: ['error'],
    // }),
    // 工厂模式返回,使用环境变量中的配置
    TypeOrmModule.forRootAsync({
      // 为了可以使用ConfigService实例对象获取环境变量
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER_NAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATE_BASE'),
          // 注册实体类
          // entities: [User, Profile, Logs, Roles],
          // 支持glob形式路径
          entities,
          // 同步本地的schema与数据库 -> 初始化的时候去使用
          synchronize: true,
          // 日志等级
          logging: ['error'],
          // 在开发环境下，输出全部日志
          // logging: process.env.NODE_ENV === 'development',
        } as TypeOrmModuleOptions;
      },
    }),
    UserModule,
    LogsModule,
    AuthModule,
  ],
  // 注册控制器
  controllers: [AppController],
  // 依赖注入，在控制器中自动实例化该服务
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, // 可以进行DI注入 LoggerService
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 必须的加这个
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    // 守卫，token验证
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
