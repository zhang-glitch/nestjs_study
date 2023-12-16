import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  // 自增
  @PrimaryGeneratedColumn()
  id: number;

  // 表述性
  @Column()
  username: string;

  @Column()
  password: string;

  // 一对多
  // 一个用户对应多个操作日志。
  // 多对一时，主表就是多的那方，在主表中建立一个外键绑定user的主件。
  // 第二个参数就是和logs表的连接条件 user.id === logs.userId
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];

  // 多对多
  @ManyToMany(() => Roles, (roles) => roles.users)
  // 建立额外关联表
  @JoinTable()
  roles: Roles[];
}
