import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseSerializeDto {
  @IsString()
  // @Exclude()
  @Expose()
  name: string;

  @IsString()
  id: string; // 这个属性将不会被返回，因为未设置Expose
}

// 如果这里的属性未设置装饰器，那么将不会被接收，例如使用@body获取请求体，将没有属性。
// 而且如果传递不在该dto中的属性时也不会被接收
export class RequestSerializeDto {
  name: string;
  id: string;
}
