import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ACCESS } from 'src/common/constants';
import { AccessType } from 'src/common/types';

@Entity()
export class AccessHistory extends BaseEntity {
  @Column({ type: 'enum', enum: ACCESS })
  type: AccessType;

  @ManyToOne(() => User)
  user: User;
}
