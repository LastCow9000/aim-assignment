import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountHistory } from './entities/account-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountHistory])],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
