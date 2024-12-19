import { Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }
}
