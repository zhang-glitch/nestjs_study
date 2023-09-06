import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getInfo(): { name: string; age: number } {
    return {
      name: 'zh',
      age: 20,
    };
  }
}
