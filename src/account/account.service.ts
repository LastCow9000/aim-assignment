import { Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccessTokenPayload, AccountType } from 'src/common/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAccount({ id }: AccessTokenPayload, type: AccountType) {
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

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }
}
