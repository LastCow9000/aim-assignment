import { IsNotEmpty, IsNumber } from 'class-validator';
import { BaseEntity } from 'src/common/bases/base.entity';
import { ACCOUNT } from 'src/common/constants';
import { AccountType } from 'src/common/types';
import { Column, Entity } from 'typeorm';

@Entity()
export class Account extends BaseEntity {
  @IsNumber()
  @IsNotEmpty()
  @Column()
  amount: number;

  @Column({ type: 'enum', enum: ACCOUNT })
  type: AccountType;
}
