import { BaseEntity } from 'src/common/bases/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Account } from './account.entity';
import { TRANSACTION } from 'src/common/constants';
import { TransactionType } from 'src/common/types';

@Entity()
export class AccountHistory extends BaseEntity {
  @Column({ type: 'enum', enum: TRANSACTION })
  type: TransactionType;

  @Column()
  amount: number;

  @ManyToOne(() => Account)
  account: Account;
}
