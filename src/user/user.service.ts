import { Logs } from 'src/logs/logs.entity';
import { User } from 'src/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
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

  // 关联查询 (一对一)
  async findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  // 多对多(以user为主记录)
  async findLogs(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        logs: true,
      },
    });
  }
  // 多对多(以logs为主记录)
  // async findLogs(id: number) {
  //   const user = await this.findById(id);
  //   return this.logsRepository.find({
  //     // 这里的条件就是logs实体类的属性
  //     where: { user },
  //     relations: {
  //       user: true,
  //     },
  //   });
  // }

  resultRange(num) {
    const arr = new Array(num).fill(0);
    return arr.map((item, index) => index + 1 + '');
  }
}
