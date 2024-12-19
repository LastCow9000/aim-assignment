import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountType } from 'src/common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TRANSACTION } from 'src/common/constants';
import { AccountHistory } from './entities/account-history.entity';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly dataSource: DataSource,
  ) {}

  async findAccount(id: number, type: AccountType) {
    const { amount } = await this.findAccountByTypeAndUserId(id, type);

    return {
      success: true,
      data: {
        amount,
      },
    };
  }

  async updateAccount(
    id: number,
    { accountType, transactionType, amount }: UpdateAccountDto,
  ) {
    const account = await this.findAccountByTypeAndUserId(id, accountType);
    if (!account) {
      throw new NotFoundException(`${accountType} 계좌가 존재하지 않습니다.`);
    }

    return this.dataSource.manager.transaction(async (entityManager) => {
      account.amount +=
        transactionType === TRANSACTION.DEPOSIT ? amount : -amount;
      if (account.amount < 0) {
        throw new BadRequestException('잔액이 부족합니다.');
      }
      await entityManager.save(account);

      const newAccountHistory = entityManager
        .getRepository(AccountHistory)
        .create({
          account,
          amount,
          type: transactionType,
          description: `유저 ${transactionType === TRANSACTION.DEPOSIT ? '입금' : '출금'}`,
        });
      await entityManager.save(newAccountHistory);

      return {
        success: true,
      };
    });
  }

  private findAccountByTypeAndUserId(id: number, type: AccountType) {
    return this.accountRepository.findOne({
      where: { type, user: { id } },
    });
  }
}
