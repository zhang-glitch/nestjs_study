import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Profile } from './profile.entity';

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

  // 对于多对一和一对一，我们只需要在对应的OneToOne,OneToMany中指定第二个参数与主表的映射属性即可。在主表中并不需要指定。设置JoinColumn注解即可。
  // 这里需要指定关联属性
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

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
