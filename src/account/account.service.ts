import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountType } from 'src/common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TRANSACTION } from 'src/common/constants';
import { AccountHistory } from './entities/account-history.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findAccount(id: number, type: AccountType) {
    const {
      account: { amount },
    } = await this.userRepository.findOne({
      where: { id, account: { type } },
      relations: ['account'],
    });

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
    const account = (
      await this.userRepository.findOne({
        where: { id, account: { type: accountType } },
        relations: ['account'],
      })
    )?.account;
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
        });
      await entityManager.save(newAccountHistory);

      return {
        success: true,
      };
    });
  }
}
