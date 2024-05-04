import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    // 当前用户的值
    // 当前属性名
    // 类
    // const
    message: `用户名必须在$constraint1到$constraint2之间，当前传递得用户名为$value`,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 64)
  password: string;
}
