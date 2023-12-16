import { User } from 'src/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 查找全部
   */
  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: number) {
    return this.userRepository.find({ where: { id } });
  }

  async createUser(user: User) {
    // 创建一个数据库实体类
    const dbUser = await this.userRepository.create(user);
    return this.userRepository.save(dbUser);
  }

  async updateUser(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  async removeUser(id: number) {
    return this.userRepository.delete(id);
  }

  resultRange(num) {
    const arr = new Array(num).fill(0);
    return arr.map((item, index) => index + 1 + '');
  }
}
