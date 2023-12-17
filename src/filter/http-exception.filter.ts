import {
  ExceptionFilter,
  LoggerService,
  HttpException,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';

// 全局处理http异常，统一响应
// 指定只捕获http异常
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    // 响应对象
    const response = ctx.getResponse();
    // const request = ctx.getRequest();
    const status = exception.getStatus();
    this.logger.error(exception.message, exception.stack);

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      message: exception.message || exception.name,
    });
  }
}
