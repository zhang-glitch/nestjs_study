import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const res = context.switchToHttp().getResponse()
    return next.handle().pipe(
      map((data) => {
        console.log('res=======返回值', data);
        // return data;
        return plainToInstance(this.dto, data, {
          // 表示设置expose和exclude才可以被响应出去。
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
