import { UserService } from './user/user.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotEnv from 'dotenv';
import * as Joi from 'joi';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
@Module({
  // 导入模块
  // ConfigModule.forRoot 加载环境变量
  imports: [
    ConfigModule.forRoot({
      // 将环境变量在全部文件模块中导入
      isGlobal: true,
      // 设置读取的环境变量文件
      envFilePath,
      // 加载自定义配置文件数组。这里可以加载提取出的相同配置文件属性
      load: [() => dotEnv.config({ path: '.env' })],
      // 验证环境变量(只能验证特定环境的配置文件，不能验证load中加载的)
      validationSchema: Joi.object({
        // 验证DB_PORT变量，并设置默认值为3306
        DB_PORT: Joi.number().valid(3306),
      }),
    }),
    UserModule,
  ],
  // 注册控制器
  controllers: [AppController, UserController],
  // 依赖注入，在控制器中自动实例化该服务
  providers: [AppService, UserService],
})
export class AppModule {}
