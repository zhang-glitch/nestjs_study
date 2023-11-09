import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  resultRange(num) {
    const arr = new Array(num).fill(0);
    return arr.map((item, index) => index + 1 + '');
  }
}
