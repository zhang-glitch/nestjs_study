import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // 登录
  @Post('/signin')
  async signin(@Body() userInfo: SigninUserDto) {
    const { username, password } = userInfo;
    return this.authService.signin({ username, password });
  }

  // 注册
  @Post('/signup')
  async signup(@Body() userInfo: SigninUserDto) {
    const { username, password } = userInfo;
    return this.authService.signup({ username, password });
  }
}
