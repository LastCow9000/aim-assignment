import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/common/bases/base.entity';
import { ACCOUNT } from 'src/common/constants';
import { AccountType } from 'src/common/types';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

@Entity()
@Unique(['user', 'type'])
export class Account extends BaseEntity {
  @IsNumber()
  @IsNotEmpty()
  @Column()
  amount: number;

  @Column({ type: 'enum', enum: ACCOUNT })
  type: AccountType;

  @ManyToOne(() => User)
  user: User;
}
