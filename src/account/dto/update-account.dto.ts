import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ACCOUNT, TRANSACTION } from 'src/common/constants';
import { AccountType, TransactionType } from 'src/common/types';

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsEnum(ACCOUNT)
  accountType: AccountType;

  @IsNotEmpty()
  @IsEnum(TRANSACTION)
  transactionType: TransactionType;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
