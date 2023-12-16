import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: number;

  @Column()
  photo: string;

  @Column()
  address: string;

  // 设置外键映射的实体类。（我们在映射的时候并不关系主键外键，他们只是一个桥接的作用，我们主要是获取两个表中的其他列属性）
  @OneToOne(() => User)
  // 默认键名叫做 关联表名+主键名称，小驼峰形式。但是我们也可以手动设置
  // 例如外表主键是index，那么这个外键命名就是userIndex
  @JoinColumn({ name: 'userId' })
  user: User;
}
